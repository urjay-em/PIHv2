from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from core.models import Profile, EmployeeDetails, ClientDetails, AgentDetails, BalanceTracker, Payment, PaymentRequest


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_or_update_profile(sender, instance, created, **kwargs):
    """Signal to create or update Profile when a User is saved."""
    if created:
        # Create profile when a new user is registered
        Profile.objects.create(
            user=instance,
            first_name=instance.first_name,  # Ensure first name is copied
            last_name=instance.last_name,  # Ensure last name is copied
            email=instance.email,  # Sync email
            phone_number=instance.phone_number,  # Sync phone number
            account_type=instance.account_type  # ✅ Ensure account type is copied
        )
        print(f"✅ New Profile created with first & last name! Account Type: {instance.account_type}")

    else:
        # Update profile when user info is updated
        if hasattr(instance, 'profile'):
            instance.profile.email = instance.email
            instance.profile.phone_number = instance.phone_number
            instance.profile.first_name = instance.first_name
            instance.profile.last_name = instance.last_name
            instance.profile.account_type = instance.account_type  # ✅ Ensure account type is updated
            instance.profile.save()
            print(f"🔄 Profile updated with user info! Account Type: {instance.account_type}")


@receiver(post_save, sender=Profile)
def create_details(sender, instance, created, **kwargs):
    """Signal to create related details (Employee, Client, Agent) when a Profile is created."""
    if created:
        print(f"🟢 Creating additional details for {instance.account_type}!")

        # Create EmployeeDetails for 'admin', 'information', and 'cashier'
        if instance.account_type in ['admin', 'information', 'cashier']:
            EmployeeDetails.objects.create(profile=instance)
            print("👔 EmployeeDetails created!")

        elif instance.account_type == 'client':
            ClientDetails.objects.create(profile=instance)
            print("💰 ClientDetails created!")

        elif instance.account_type == 'agent':
            AgentDetails.objects.create(profile=instance)
            print("📈 AgentDetails created!")



@receiver(post_save, sender=Payment)
def update_balance_tracker(sender, instance, created, **kwargs):
    # Ensure the instance is for an existing payment (not a new one)
    if created or not created:  # This will handle both new and updated payments
        try:
            # Retrieve the associated BalanceTracker based on paymentrequest, client, and plot
            balance_tracker = BalanceTracker.objects.get(
                paymentrequest=instance.payment_request,
                client=instance.client,
                plot=instance.plot
            )

            # Check if the current BalanceTracker exists
            if balance_tracker:
                # Only perform calculations if the amount has changed or as needed
                newTotalPaid = balance_tracker.total_paid + instance.amount
                newRemainingBalance = balance_tracker.total_price - newTotalPaid
                newPaymentsMade = balance_tracker.payments_made + 1

                # Update the BalanceTracker fields
                balance_tracker.total_paid = newTotalPaid
                balance_tracker.last_amount_paid = instance.amount
                balance_tracker.payments_made = newPaymentsMade
                balance_tracker.remaining_balance = newRemainingBalance
                balance_tracker.save()

        except BalanceTracker.DoesNotExist:
            # If no BalanceTracker exists, create a new one
            BalanceTracker.objects.create(
                paymentrequest=instance.payment_request,
                client=instance.client,
                plot=instance.plot,
                total_paid=instance.amount,
                last_amount_paid=instance.amount,
                payments_made=1,
                remaining_balance=instance.payment_request.price - instance.amount,
                payment_plan=instance.payment_request.payment_plan
            )
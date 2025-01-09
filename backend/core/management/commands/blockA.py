from django.core.management.base import BaseCommand
from core.models import Plot, Block

class Command(BaseCommand):
    help = 'Populate plots for Block A with ID 1'

    def handle(self, *args, **kwargs):
        block_a = Block.objects.get(id=1) 
        
        for i in range(500):
            plot = Plot.objects.create(
                status='vacant',
                plot_type='lawn',
                purchase_date=None, 
                owner=None, 
                block=block_a,
                name="" 
            )

            plot.name = f"p{plot.plot_id}b{block_a.id}"
            plot.save()

            self.stdout.write(self.style.SUCCESS(f"Plot {plot.name} created successfully!"))

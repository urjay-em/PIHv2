from django.core.management.base import BaseCommand
from shapely.geometry import Polygon, box
from core.models import Plot

class Command(BaseCommand):
    help = 'Generates plots closely packed within Block A'

    def handle(self, *args, **kwargs):
        # Define block polygon coordinates
        block_a_coords = [
            (118.71822953224182, 9.840972700656032),
            (118.71797807514668, 9.840821513357708),
            (118.71826037764552, 9.840439118774944),
            (118.71849507093431, 9.840614733912162)
        ]
        polygon = Polygon(block_a_coords)

        # Plot dimensions (adjust if needed)
        plot_width = 0.00001   # degrees longitude
        plot_height = 0.00001  # degrees latitude

        # Get bounding box of the polygon
        minx, miny, maxx, maxy = polygon.bounds

        created = 0
        plot_num = 1

        # Start generating cells in grid-like fashion
        y = miny
        while y + plot_height <= maxy:
            x = minx
            while x + plot_width <= maxx:
                cell = box(x, y, x + plot_width, y + plot_height)
                if polygon.contains(cell.centroid):
                    plot = Plot(
                        status='vacant',
                        plot_type='lawn',
                        purchase_date=None,
                        client_id=None,
                        block_id=1,
                        plot_name=f'BA-P{plot_num}',
                        max_bodies=2,
                        latitude=cell.centroid.y,
                        longitude=cell.centroid.x
                    )
                    plot.save()
                    created += 1
                    plot_num += 1
                x += plot_width
            y += plot_height

        self.stdout.write(self.style.SUCCESS(f"✅ {created} plots tightly packed inside Block A."))

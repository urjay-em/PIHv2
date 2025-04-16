from django.core.management.base import BaseCommand
from shapely.geometry import Polygon, box
from core.models import Plot, Block
import json

class Command(BaseCommand):
    help = "Generate 400 marker plots inside Block A aligned with its perimeter"

    def handle(self, *args, **kwargs):
        block = Block.objects.get(block_name="Block A")
        coordinates = json.loads(block.coordinates) if isinstance(block.coordinates, str) else block.coordinates
        polygon = Polygon(coordinates)

        minx, miny, maxx, maxy = polygon.bounds
        total_plots = 400
        columns = 20
        rows = 20

        step_x = (maxx - minx) / columns
        step_y = (maxy - miny) / rows

        created = 0
        plot_num = 1

        for row in range(rows):
            for col in range(columns):
                if created >= total_plots:
                    break
                x = minx + col * step_x
                y = miny + row * step_y

                cell = box(x, y, x + step_x, y + step_y)
                centroid = cell.centroid
                if polygon.contains(centroid):
                    Plot.objects.create(
                        plot_name=f"BA-P{plot_num}",
                        block=block,
                        latitude=centroid.y,
                        longitude=centroid.x,
                        plot_type='lawn'  # or any default you want
                    )
                    created += 1
                    plot_num += 1

        self.stdout.write(self.style.SUCCESS(f"✅ {created} marker plots generated inside Block A."))

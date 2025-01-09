from django.core.management.base import BaseCommand
from shapely.geometry import Point, Polygon
import random
from core.models import Plot

class Command(BaseCommand):
    help = 'Generates 200 plots arranged in rows inside Block A'

    def handle(self, *args, **kwargs):
        block_a_coords = [
            (9.840972700656032, 118.71822953224182),
            (9.840821513357708, 118.71797807514668),
            (9.840439118774944, 118.71826037764552),
            (9.840614733912162, 118.71849507093431)
        ]
        polygon = Polygon(block_a_coords)

        def generate_grid_points_within_bounds(polygon, num_points=200):
            points = set()
            min_x, min_y, max_x, max_y = polygon.bounds
            rows = 10
            cols = int(num_points / rows)

            for row in range(rows):
                for col in range(cols):
                    lat = min_x + (max_x - min_x) * (col / (cols - 1))
                    lon = min_y + (max_y - min_y) * (row / (rows - 1))
                    point = Point(lat, lon)

                    if polygon.contains(point):
                        points.add((lat, lon))

                    if len(points) >= num_points:
                        break
                if len(points) >= num_points:
                    break

            return list(points)

        random_points = generate_grid_points_within_bounds(polygon, 200)

        for idx, point in enumerate(random_points, start=1):
            plot_n = f'BA-P{idx}'
            print(f'Generating plot with name: {plot_n}')
            plot = Plot(
                status='vacant',
                plot_type='lawn', 
                purchase_date=None,
                owner_id=None,
                block_id=1,
                plot_name=plot_n,
                max_bodies=2,
                latitude=point[0],
                longitude=point[1]
            )
            plot.save()

        self.stdout.write(self.style.SUCCESS(f'Successfully generated {len(random_points)} plots'))

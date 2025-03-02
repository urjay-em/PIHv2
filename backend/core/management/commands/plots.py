from django.core.management.base import BaseCommand
from django.db import connection
import math

class Command(BaseCommand):
    help = "Insert plots into the database"

    def generate_grid(self, block_name, block_coords, num_plots):
        plots = []
        rows = math.ceil(math.sqrt(num_plots))
        cols = math.ceil(num_plots / rows)

        lat_min = min(c[0] for c in block_coords)
        lat_max = max(c[0] for c in block_coords)
        lng_min = min(c[1] for c in block_coords)
        lng_max = max(c[1] for c in block_coords)

        lat_step = (lat_max - lat_min) / rows
        lng_step = (lng_max - lng_min) / cols

        count = 1
        for i in range(rows):
            for j in range(cols):
                if count > num_plots:
                    return plots
                plot_id = f"{block_name}-{count}"
                lat = lat_min + i * lat_step
                lng = lng_min + j * lng_step
                plots.append((plot_id, lat, lng, block_name))
                count += 1
        return plots

    def insert_plots_to_db(self):
        block_a_coords = [
            (9.840972700656032, 118.71822953224182),
            (9.840821513357708, 118.71797807514668),
            (9.840439118774944, 118.71826037764552),
            (9.840614733912162, 118.71849507093431)
        ]

        plots = self.generate_grid("A", block_a_coords, 500)

        with connection.cursor() as cursor:
            cursor.executemany(
                """INSERT INTO plots (plot_id, latitude, longitude, block) VALUES (%s, %s, %s, %s)""",
                plots
            )
        self.stdout.write(self.style.SUCCESS("Inserted plots successfully."))

    def handle(self, *args, **kwargs):
        self.insert_plots_to_db()

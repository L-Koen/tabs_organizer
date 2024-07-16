from django.core.exceptions import ValidationError
from django.db import models


class Artist(models.Model):
    """Model for the artists/performers linked with the song"""

    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Song(models.Model):
    """Song Model.
    Right now in the simpelest version.
    More fields can be added later.
    """

    title = models.CharField(max_length=200)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="songs")
    lyrics_and_chords = models.JSONField()  # Using JSONField which works with SQLite
    structure = models.TextField(help_text="Comma-separated list of song sections")

    def clean(self):
        """Make sure that the structure makes sense with the given lyrics and chords
        If structure is provided as a Python list, convert it to comma-separated string.
        """
        # Ensure the structure field is not empty
        if not self.structure:
            raise ValidationError("The structure field cannot be empty.")

        print(type(self.structure))

        # If structure is a list, convert it to a comma-separated string
        if isinstance(self.structure, list):
            self.structure = ",".join(self.structure)
            print(self.structure)

        # Call the parent class's clean method
        super().clean()

        # Custom validation logic
        print(self.structure)
        structure_list = [part.strip() for part in self.structure.split(",")]
        lyrics_and_chords = self.lyrics_and_chords

        for part in structure_list:
            if part not in lyrics_and_chords:
                raise ValidationError(
                    f"'{part}' is mentioned in the structure but not found in the lyrics_and_chords field"
                )
        for key in lyrics_and_chords.keys():
            if key not in structure_list:
                raise ValidationError(
                    f"'{key}' is mentioned in the lyrics_and_chords field but not found in the structure"
                )

    def __str__(self):
        return self.title + " - " + self.artist.name

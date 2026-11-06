# How does mood change in the hours after sport?

Study enrolment page for TUM university sports participants. Links to the
momenTUM app and shows the study QR code and ID for the selected language
and course end time. The page language also selects the study language.

## Study configuration

- `_data/studies.yml`: course sessions and English/German study IDs. Replace
  the `REPLACE_*` values and set `placeholder: false` for completed entries.
- `assets/qr/`: study QR images. Set each entry's `qr_image` to its image path,
  e.g. `/assets/qr/en-1730.png`. Leave it empty to show the placeholder.
- `_config.yml`: study titles (`study_title` and `study_title_de`).

QR images should contain the enrolment code supplied for the corresponding study.

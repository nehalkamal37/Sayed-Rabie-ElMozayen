# Media credits

Third-party media used on the site, with its source and license. Stock media shows
people and places that are not El Mozayen staff or branches, and the site must not
present it as theirs: each clip's label (in `src/data/stock-clips.ts`) only describes
the action. Clips appear in the Signature preview only. All files are the unaltered
720p downloads; posters are single frames taken from them.

| Slot | File (`public/videos/`) | Clip | Length | Source | License |
|---|---|---|---|---|---|
| Story | `stock-haircut.mp4` | "Barber cutting the hair of a bearded man" (Mixkit 43222) | 14.9 s, 1280×720, no audio, 5.2 MB | https://mixkit.co/free-stock-video/barber-cutting-the-hair-of-a-bearded-man-43222/ | Mixkit Stock Video Free License |
| Services: cut and beard | `stock-beard-shaping.mp4` | "Barber shaping the beard of a man" (Mixkit 43279) | 8.8 s, 1280×720, no audio, 3.2 MB | https://mixkit.co/free-stock-video/barber-shaping-the-beard-of-a-man-43279/ | Mixkit Stock Video Free License |
| Services: hair treatment and colour | `stock-hair-colour.mp4` | "A Person Dyeing a Man's Hair" (Pexels 7383795) | 10.0 s, 720×1280, no audio, 3.5 MB | https://www.pexels.com/video/a-person-dyeing-a-man-s-hair-7383795/ | Pexels License |
| Services: skin care | `stock-face-mask.mp4` | "Applying Mud Mask in a Man's Face Using Brushes" (Pexels 6975347) | 19.4 s, 1366×720, no audio, 3.1 MB | https://www.pexels.com/video/applying-mud-mask-in-a-man-s-face-using-brushes-6975347/ | Pexels License |
| Groom | `stock-groom-bow-tie.mp4` | "Groom adjusting the bow tie of his tuxedo" (Mixkit 5185) | 15.6 s, 1280×720, no audio, 4.8 MB | https://mixkit.co/free-stock-video/groom-adjusting-the-bow-tie-of-his-tuxedo-5185/ | Mixkit Stock Video Free License |
| Closing | `stock-barber-chairs.mp4` | "Male Barber Chairs" (Mixkit 43236) | 12.4 s, 1280×720, no audio, 4.3 MB | https://mixkit.co/free-stock-video/male-barber-chairs-43236/ | Mixkit Stock Video Free License |

Downloaded 2026-11-26. Each clip's page showed its license at download time.

## Licenses

- **Mixkit Stock Video Free License** (https://mixkit.co/license/#videoFree): commercial
  and non-commercial use; may be downloaded, copied, modified, distributed and publicly
  performed; attribution not required. Limits are in Mixkit's User Terms.
- **Pexels License** (https://www.pexels.com/license/): free to use and modify;
  attribution not required. Not allowed: showing identifiable people in a bad light,
  implying endorsement by the people or brands shown, selling unaltered copies,
  redistributing on other stock platforms, or using the media as a trademark.

## Notes

- The closing clip shows another barbershop's round logo on the far right of the frame.
  `object-position: 12% 50%` crops it out at every layout width (checked from 390 to
  1920 px). Keep that crop if the clip's box changes.

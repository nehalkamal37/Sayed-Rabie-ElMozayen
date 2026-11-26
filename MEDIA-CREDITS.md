# Media credits

Third-party media used on the site, with its source and license. Stock media shows
people and places that are not El Mozayen staff or branches, and the site must not
present it as theirs: each clip's label (in `src/data/media.ts`, the single place to
swap media) only describes the action, and the homepage captions stock footage as
illustrative. Files are unaltered downloads; posters are single frames taken from them.

| Slot | File (`public/videos/`) | Clip | Length | Source | License |
|---|---|---|---|---|---|
| Hero film | `stock-haircut.mp4` | "Barber cutting the hair of a bearded man" (Mixkit 43222) | 14.9 s, 1280×720, no audio, 5.2 MB | https://mixkit.co/free-stock-video/barber-cutting-the-hair-of-a-bearded-man-43222/ | Mixkit Stock Video Free License |
| Services: cut and beard | `stock-beard-shaping.mp4` | "Barber shaping the beard of a man" (Mixkit 43279) | 8.8 s, 1280×720, no audio, 3.2 MB | https://mixkit.co/free-stock-video/barber-shaping-the-beard-of-a-man-43279/ | Mixkit Stock Video Free License |
| Services: hair treatment and colour | `stock-hair-colour.mp4` | "A Person Dyeing a Man's Hair" (Pexels 7383795) | 10.0 s, 720×1280, no audio, 3.5 MB | https://www.pexels.com/video/a-person-dyeing-a-man-s-hair-7383795/ | Pexels License |
| Services: skin care | `stock-face-mask.mp4` | "Applying Mud Mask in a Man's Face Using Brushes" (Pexels 6975347) | 19.4 s, 1366×720, no audio, 3.1 MB | https://www.pexels.com/video/applying-mud-mask-in-a-man-s-face-using-brushes-6975347/ | Pexels License |
| Groom film | `stock-groom-bow-tie.mp4` | "Groom adjusting the bow tie of his tuxedo" (Mixkit 5185) | 15.6 s, 1280×720, no audio, 4.8 MB | https://mixkit.co/free-stock-video/groom-adjusting-the-bow-tie-of-his-tuxedo-5185/ | Mixkit Stock Video Free License |
| Branches atmosphere | `stock-barber-chairs.mp4` | "Male Barber Chairs" (Mixkit 43236) | 12.4 s, 1280×720, no audio, 4.3 MB | https://mixkit.co/free-stock-video/male-barber-chairs-43236/ | Mixkit Stock Video Free License |
| Craft interlude | `stock-razor-flame.mp4` | "Male Hands Sterilizing Razor Close-Up" (Pexels 5450144) | 12.8 s, 1280×720, no audio, 2.6 MB | https://www.pexels.com/video/male-hands-sterilizing-razor-close-up-5450144/ | Pexels License |
| Brand story film | `stock-tools-on-black.mp4` | "Hair Cutting Tools" (Pexels 7697179) | 9.2 s, 1280×720, no audio, 3.1 MB | https://www.pexels.com/video/hair-cutting-tools-7697179/ | Pexels License |
| Reels | `stock-vertical-shave.mp4` | "Barber Shaving a Man's Beard" (Pexels 7426681) | 15.0 s, 540×960, no audio, 0.6 MB | https://www.pexels.com/video/barber-shaving-a-man-s-beard-7426681/ | Pexels License |
| Reels | `stock-vertical-clippers.mp4` | "Barber Trimming a Man's Beard" (Pexels 7697102) | 10.9 s, 540×960, no audio, 1.1 MB | https://www.pexels.com/video/barber-trimming-a-man-s-beard-7697102/ | Pexels License |
| Reels | `stock-vertical-haircut.mp4` | "Haircut at Barber Shop" (Pexels 7697084) | 7.5 s, 540×960, no audio, 1.3 MB | https://www.pexels.com/video/haircut-at-barber-shop-7697084/ | Pexels License |
| Reels | `stock-vertical-tools.mp4` | "A Different Types of Barber Tools on the Table" (Pexels 8867303) | 11.1 s, 540×960, no audio, 0.7 MB | https://www.pexels.com/video/a-different-types-of-barber-tools-on-the-table-8867303/ | Pexels License |

Downloaded 2026-11-26. Photos in `public/photos-temporary/` are Pexels stock, credited in
`src/data/photos.ts`. The portrait placed earlier (`public/DQw0pW7X0LnC83fdepEJYPC30.avif`)
is no longer shown: it is published on saeidrabie.com and is not confirmed to show
Sayed Rabie. `ownerPortrait` in `src/data/media.ts` stays empty until an approved photo arrives. Each clip's page showed its license at download time.

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

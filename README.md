# MSR (My Sung Russian)

**IPA transcription tool for singers learning Russian vocal repertoire**

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Overview

MSR implements the phonetic transcription rules from Craig Grayson's *Russian Lyric Diction* (2012), providing singers and voice teachers with accurate IPA transcriptions tailored for classical singing contexts.

## Features

- **Automatic stress lookup** from 51,000+ word dictionary
- **Word-for-word English glosses** for translation assistance
- **Click-to-override stress** for performance contexts
- **Grayson-compliant IPA** output validated against forbidden glyphs
- **Exception handling** for irregular pronunciations (Appendix F)

## Directory Structure

```
msr/
├── public/
│   └── index.html          # Main app entry
├── src/
│   ├── core/
│   │   ├── dictionary.js   # Layered dictionary lookup
│   │   ├── engine.js       # Processing engine
│   │   ├── phonology.js    # Phonological rules
│   │   ├── transcribe.js   # IPA transcription
│   │   └── transcript.js   # Transcript handling
│   ├── ui/                 # UI components
│   └── index.js            # Entry point
├── data/
│   ├── openrussian-dict.json   # Base dictionary (51K words)
│   ├── exception-words.js      # Grayson Appendix F
│   ├── stress-corrections.js   # Manual overrides
│   └── yo-exceptions.js        # Ё handling
├── tests/                  # Test suite
├── css/                    # Stylesheets
└── build.mjs               # Build script
```

## Setup

```bash
npm install
npm run build
```

Open `public/index.html` in browser.

## Testing

```bash
npm test
```

Or in browser console:
```javascript
runGoldenTests()
```

## Dictionary Lookup Priority

1. **Manual corrections** - User overrides (highest priority)
2. **Exception words** - Grayson Appendix F irregular pronunciations
3. **OpenRussian** - Base dictionary with stress and glosses
4. **User harvest** - Words added during session (lowest priority)

## Credits

**Developer:** Dann Mitton  
**AI Assistant:** Claude (Anthropic)  
**Architecture Consultation:** KIMI  
**Transcription Rules:** Craig Grayson, *Russian Lyric Diction* (2012)

## Data Sources

**Dictionary:** [OpenRussian.org](https://en.openrussian.org/)  
Licensed under [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/)  
Source repository: [github.com/Badestrand/russian-dictionary](https://github.com/Badestrand/russian-dictionary)

## License

This project is licensed under the GNU General Public License v3.0. See [LICENSE](LICENSE) for details.

The OpenRussian dictionary data is licensed under CC-BY-SA-4.0 and requires attribution as shown above.

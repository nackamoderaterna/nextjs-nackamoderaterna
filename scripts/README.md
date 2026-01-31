# Migration Scripts

## migrate-political-areas

Converts the `politicalAreas` field on politician documents from the old structure (array of references) to the new structure (array of objects with `politicalArea` reference and `showOnPoliticalAreaPage` boolean).

### What it does

- Finds all politicians with `politicalAreas` field
- Checks if they use the old structure (direct references)
- Converts each reference to: `{ politicalArea: reference, showOnPoliticalAreaPage: false }`
- Updates the documents in Sanity

### Prerequisites

1. **Sanity API Token**: You need a token with write access to your Sanity project
   - Go to https://www.sanity.io/manage
   - Select your project
   - Go to API → Tokens
   - Create a new token with Editor permissions (or higher)

2. **Environment Variables**: Set the following:
   ```bash
   export SANITY_API_TOKEN="your-token-here"
   # Optional if not already set:
   export NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
   export NEXT_PUBLIC_SANITY_DATASET="production" # or "development"
   ```

### Usage

**Option 1: Using npm script**
```bash
SANITY_API_TOKEN="your-token" npm run migrate:political-areas
```

**Option 2: Direct execution**
```bash
SANITY_API_TOKEN="your-token" node scripts/migrate-political-areas.js
```

**Option 3: TypeScript version (if you have tsx installed)**
```bash
SANITY_API_TOKEN="your-token" npx tsx scripts/migrate-political-areas.ts
```

### Safety Features

- **Dry-run safe**: The script checks if data is already migrated and skips it
- **Idempotent**: Can be run multiple times safely
- **Error handling**: Continues processing even if individual documents fail
- **Detailed logging**: Shows progress and summary

### Output

The script will:
- Show which politicians are being migrated
- Skip politicians that already use the new structure
- Display a summary at the end with counts of migrated, skipped, and errors

### Example Output

```
Starting migration of politicalAreas...
Project: 0vagy5jk, Dataset: production

Found 15 politicians with politicalAreas

✓ Migrated John Doe (3 areas)
✓ Migrated Jane Smith (2 areas)
✓ Skipping Bob Johnson - already using new structure
...

=== Migration Summary ===
Total politicians checked: 15
Migrated: 12
Skipped (already migrated): 3
Errors: 0

✅ Migration completed successfully!
```

### Important Notes

- **Backup**: Consider backing up your dataset before running migrations
- **Test first**: Run on a development dataset first if possible
- **Default value**: All migrated entries will have `showOnPoliticalAreaPage: false` by default. You'll need to manually set this to `true` in Sanity Studio for politicians you want to show on political area pages.

## set-news-variant-default

Sets `variant` to `"default"` for all news documents that have no variant (or an invalid value).

### Usage

```bash
SANITY_API_TOKEN="your-token" npm run migrate:news-variant
```

Or directly:

```bash
SANITY_API_TOKEN="your-token" npx tsx scripts/set-news-variant-default.ts
```

### What it does

- Fetches all news documents
- Updates those where `variant` is missing, `null`, or not one of `default` / `debate` / `pressrelease`
- Leaves documents that already have a valid variant unchanged

## migrate-politician-social-links

Moves politician social media from the old field `socialMedia` to the new shared field `socialLinks` (same URL shape: facebook, twitter, instagram, linkedin, tiktok). After migration, the old `socialMedia` field is removed.

### What it does

- Finds all politicians that have `socialMedia` with at least one URL
- Sets `socialLinks` to that object (with `_type: "socialLinks"`) and unsets `socialMedia`
- Skips politicians that have no URLs in `socialMedia`

### Usage

```bash
SANITY_API_TOKEN="your-token" npm run migrate:politician-social-links
```

Or directly:

```bash
SANITY_API_TOKEN="your-token" npx tsx scripts/migrate-politician-social-links.ts
```

### Prerequisites

- `SANITY_API_TOKEN` with write access
- `NEXT_PUBLIC_SANITY_PROJECT_ID` (or `SANITY_PROJECT_ID`)
- `NEXT_PUBLIC_SANITY_DATASET` (or `SANITY_DATASET`, default: production)

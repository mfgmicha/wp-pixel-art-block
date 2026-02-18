# Pixel Art Block - Storage Architecture

> Separate spec for handling visitor-drawn pixel art persistence

---

## Requirement

Editor configures block → Visitors draw on frontend → Multiple drawings per post from different users.

---

## Option A: Post Meta + User Hash (Recommended)

Store all drawings in single post meta as JSON:

```json
{
  "user_hash_1": { "pixels": [0,5,10], "color": "#ff0000", "timestamp": 1234567890 },
  "user_hash_2": { "pixels": [1,2,3], "color": "#00ff00", "timestamp": 1234567891 }
}
```

- **User ID**: Cookie-generated hash (e.g., `pixel_user_abc123`)
- **Storage**: Existing `wp_postmeta` table
- **Pros**: No new tables, WordPress handles it
- **Cons**: Meta can grow (mitigate: per-user limits)

---

## Option B: Custom Table

```sql
CREATE TABLE wp_pixel_art_drawings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  post_id BIGINT NOT NULL,
  user_hash VARCHAR(32) NOT NULL,
  pixels JSON NOT NULL,
  color VARCHAR(7) DEFAULT '#000000',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_post (post_id),
  INDEX idx_user (post_id, user_hash)
);
```

- **Pros**: Scalable, proper schema
- **Cons**: Requires plugin activation hooks, more complex

---

## Option C: localStorage + URL Share

- Drawings in browser localStorage
- Share via URL: `?d=base64pixels`
- **Pros**: Zero server changes
- **Cons**: No collaborative drawing

---

## Option D: Hybrid

- Default: localStorage for personal drawing
- "Save" button sends to server
- Admin sees submissions in editor
- **Pros**: Simple, opt-in persistence

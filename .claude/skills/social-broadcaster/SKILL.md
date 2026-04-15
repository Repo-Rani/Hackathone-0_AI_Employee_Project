---
name: social-broadcaster
description: >
  Use this skill when content needs to be posted to multiple social media
  platforms simultaneously. Trigger keywords: "post everywhere", "all platforms",
  "social media update", "broadcast this", "share on all channels", milestone
  achieved, weekly business update, product launch, or any content that should
  reach LinkedIn + Facebook + Instagram + Twitter. Also trigger when the daily
  9:05 AM scheduler runs. Creates a single POST file with 4 platform-specific
  sections optimized for each platform's audience and character limits.
---

# Social Broadcaster Skill

## Purpose
Generate platform-optimized content for all 4 platforms from a single briefing.
Creates one POST file that facebook_poster, instagram_poster, and twitter_poster
will each read and use their own section.

## Trigger Conditions
- "post everywhere" or "all platforms" in message
- Daily 9:05 AM scheduled task runs
- Milestone achieved (deal closed, project delivered, goal hit)
- Weekly business update needed

## Instructions
1. Read source content: Business_Goals.md, Done/ folder, or user message
2. Identify the core message (1-2 sentences max — the single idea to communicate)
3. Create /Social/Queue/POST_{YYYYMMDD}_{slug}.md with all 4 sections:
   - LinkedIn Version: 150-300 words, 3-5 hashtags, B2B professional tone, value-focused
   - Facebook Version: 100-250 words, 2-3 hashtags, community/conversational tone
   - Instagram Version: 2200 chars max, 10-15 hashtags, visual description first,
     emoji-friendly, begin with a hook
   - Twitter Version: UNDER 240 chars, punchy hook, no hashtags in main body
4. Set frontmatter: platforms: linkedin, facebook, instagram, twitter
5. Set status: queued, auto_approved: true
6. Log to /Logs/ with action_type: social_broadcast

## Rules (from Company_Handbook.md)
- Client names NEVER appear in any social post
- Financial data (revenue, profit, salary) NEVER in social posts
- Maximum 3 posts per platform per day
- Twitter: HARD limit 240 chars — truncate at sentence boundary if needed
- Instagram: image_path must be set if image is needed — never leave empty silently

## Output Format
/Social/Queue/POST_{YYYYMMDD}_{slug}.md with:
  - YAML frontmatter (platforms, status, auto_approved, image_path)
  - ## LinkedIn Version
  - ## Facebook Version
  - ## Instagram Version
  - ## Twitter Version

## Error Handling
- If no meaningful content found → log and skip, do not create empty post
- If image_path needed but not provided → set image_path: "" and log warning
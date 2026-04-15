---
name: linkedin-poster
description: >
  Professional LinkedIn post generate karo business activity ke basis par.
  Posts should be value-driven, professional, and within daily limits.
  Trigger: "linkedin post banao" | "professional post" | "business update" |
  scheduled posting request.
---

# LinkedIn Poster Skill

## Purpose
Professional aur engaging LinkedIn posts generate karo business activity, achievements,
aur industry insights ke basis par. Posts should align with business goals and
Company_Handbook.md guidelines.

## Trigger Conditions
- User kahe: "linkedin post banao", "professional post", "business update"
- Scheduled posting request
- Business achievement needs highlighting
- Industry insight to share

## Instructions

1. Business_Goals.md read karo current targets aur achievements ke liye
2. /Done/ folder mein recent activities dhundo for content ideas
3. Post content create karo following professional standards
4. 3-5 relevant hashtags add karo
5. /Social/Queue/POST_{timestamp}.md banao — scheduled format mein
6. Schedule time set karo (default: next business hour)
7. Daily limits check karo (MAX_LINKEDIN_POSTS_PER_DAY)
8. Dashboard.md update karo — Recent Activity section mein add karo

## Rules (Company_Handbook.md se)
- Professional content only - no personal opinions
- Value-driven posts - focus on industry insights
- Client success stories - with permission only
- Maximum 5 posts per day to avoid spam
- Maintain professional tone always

## Output Format
- /Social/Queue/POST_{timestamp}.md — with scheduled_for field
- Dashboard.md — updated Recent Activity

## Post Structure
```
---
type: linkedin_post
scheduled_for: {ISO_timestamp}
status: queued
auto_approved: true
topic: {post_category}
---

# Post Content
Professional content with value-driven insights, industry trends, or business updates

# Hashtags
#Business #AI #Professional #Industry #Innovation

# Engagement Question
What are your thoughts on this topic?
```

## Content Guidelines
- 1-2 paragraphs maximum
- Professional tone throughout
- Value-add for audience
- Industry-specific insights
- No confidential business info

## Error Handling
- Daily limit reach → delay post or notify user
- Insufficient content → suggest alternative topics
- Invalid format → correct and retry
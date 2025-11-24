# AI HR Interview Platform - Usage Guide

## 🎯 Quick Start Guide

### Logging In

1. Navigate to `http://localhost:3000`
2. You'll be redirected to the login page
3. Use demo credentials:
   - Email: `hr@company.com`
   - Password: `password123`
4. Or click on "Google" or "Microsoft" for mocked SSO login

### Dashboard Overview

After logging in, you'll see the dashboard with:

#### Metrics Cards
- **Total Interviews**: All interviews in the system
- **This Week**: Interviews scheduled this week
- **Pending Candidates**: Candidates awaiting interview
- **Completed**: Finished interviews
- **Average Score**: Mean score across all completed interviews
- **Most Active Position**: Job position with most interviews

#### Quick Views
- **Upcoming Interviews**: Next 3 critical interviews
- **Recent Interviews**: Latest 5 interview activities

## 📋 Managing Interviews

### Viewing All Interviews

1. Click "Interviews" in the sidebar
2. Use the search bar to find specific candidates
3. Filter by:
   - Position (dropdown)
   - Status (Pending, Completed, Awaiting Response)
4. Click "View" on any row to see details

### Creating a New Interview

1. Click "Create Interview" button
2. Fill in the form:

   **Candidate Information:**
   - Candidate Name (required)
   - Email (required)
   - Position (select from dropdown)

   **Interview Details:**
   - Interview Type:
     - **Assessment**: Written/text-based questions
     - **Video Interview**: AI-powered video analysis
     - **Assessment + Video**: Combined approach
   - Interview Date (use calendar picker)
   - Question Template (optional - select from existing)
   - Calendar Sync (Google/Outlook/None)
   - Notes (optional)

3. Click "Create Interview"
4. You'll be redirected to the interviews list

### Viewing Interview Details

Click "View" on any interview to see:

#### For Video Interviews:
- Video player with recording
- AI Evaluation Scores:
  - Communication (0-100%)
  - Confidence (0-100%)
  - Clarity (0-100%)
  - Technical Understanding (0-100%)
- Full transcript
- HR notes

#### For Assessments:
- Question-by-question breakdown
- Scores per question
- Total assessment score
- Performance ranking

#### For All Interviews:
- Candidate information
- Interview date/time
- Status badge
- Overall score
- Download report button (for completed)

## 📝 Managing Question Templates

### Viewing Templates

1. Click "Question Templates" in sidebar
2. See all templates with:
   - Template name (⭐ indicates favorites)
   - Question count
   - Created date
   - Created by
   - Usage count (how many times used)

### Template Actions

Click the "⋮" menu on any template row to:
- **Duplicate**: Create a copy
- **Edit**: Modify template (not implemented in MVP)
- **Add to Favorites**: Mark as favorite
- **Delete**: Remove template (with confirmation)

### Searching Templates

Use the search bar to find templates by name

## ⚙️ Settings

1. Click "Settings" in sidebar
2. Update:
   - Profile information (Name, Email)
   - Notification preferences
   - Email notifications toggle
   - Interview reminders toggle

## 🌍 Language Switching

1. Click the globe icon (🌐) in the top-right corner
2. Interface switches between English and Turkish
3. Preference is saved automatically

## 👤 User Profile

1. Click your avatar in the top-right corner
2. Dropdown shows:
   - Your name and email
   - Settings link
   - Logout option

## 🔍 Using Filters & Search

### Interview Page Filters
- **Search**: Type candidate name or email
- **Position Filter**: Select job position
- **Status Filter**: Choose interview status
- Filters work together (AND logic)

### Table Navigation
- **Previous/Next**: Navigate pages
- **10 rows per page** default
- Sorting by clicking column headers

## 📊 Understanding Interview Statuses

- **Pending** (Yellow badge): Interview scheduled but not conducted
- **Completed** (Green badge): Interview finished and scored
- **Awaiting Response** (Gray badge): Invitation sent, waiting for candidate

## 🎨 Understanding Interview Types

- **Video** (Blue badge): AI-powered video interview
- **Assessment** (Green badge): Text-based question assessment
- **Assessment + Video** (Purple badge): Combined approach

## 📈 Reading Metrics

### Score Interpretation
- **85-100%**: Excellent candidate
- **70-84%**: Good candidate
- **60-69%**: Average candidate
- **Below 60%**: Needs improvement

### AI Video Scores
Each metric (Communication, Confidence, Clarity, Technical) is scored independently:
- **90-100**: Outstanding
- **80-89**: Very good
- **70-79**: Good
- **60-69**: Fair
- **Below 60**: Needs work

## 🔐 Logging Out

1. Click "Logout" at bottom of sidebar, OR
2. Click avatar → Settings dropdown (future)
3. You'll be redirected to login page

## 💡 Tips & Best Practices

### For HR Managers
1. **Create templates first** before scheduling interviews
2. **Use descriptive names** for templates
3. **Review AI scores** but combine with human judgment
4. **Add HR notes** for team collaboration
5. **Use filters** to manage large candidate pools

### Interview Scheduling
1. **Pick templates** matching job position
2. **Enable calendar sync** to avoid conflicts
3. **Add notes** about specific requirements
4. **Use combo type** for senior positions

### Template Management
1. **Duplicate successful templates** instead of creating from scratch
2. **Mark favorites** for quick access
3. **Track usage counts** to identify effective templates
4. **Delete unused** templates to reduce clutter

## 🚨 Troubleshooting

### Login Issues
- Check credentials: `hr@company.com` / `password123`
- Try SSO options if credentials don't work
- Clear browser cache and retry

### Page Not Loading
- Check network connection
- Refresh the page (F5)
- Check browser console for errors

### Missing Data
- This is a demo with mock data
- Creating new items adds to mock data temporarily
- Data resets on server restart

### Language Issues
- Click globe icon to switch languages
- Currently supports English and Turkish
- Browser language detected automatically

## 📱 Mobile Usage

The platform is fully responsive:
- **Sidebar** collapses to hamburger menu
- **Tables** become scrollable
- **Cards** stack vertically
- **Forms** adapt to screen size

## ⌨️ Keyboard Shortcuts

- **Tab**: Navigate form fields
- **Enter**: Submit forms
- **Esc**: Close dialogs/modals
- **Arrow keys**: Navigate tables

## 🎯 Common Workflows

### Workflow 1: Schedule New Interview
1. Login → Dashboard
2. Click "Interviews" → "Create Interview"
3. Fill candidate info and select position
4. Choose interview type
5. Select date and template
6. Submit

### Workflow 2: Review Completed Interview
1. Login → Dashboard
2. Click "Interviews"
3. Find completed interview
4. Click "View"
5. Review AI scores/assessment
6. Add HR notes
7. Download report

### Workflow 3: Create Template
1. Login → Dashboard
2. Click "Question Templates"
3. Click "Create Template" (not fully implemented)
4. Add questions with difficulty levels
5. Set evaluation criteria
6. Save template

### Workflow 4: Filter & Find Candidates
1. Go to "Interviews"
2. Use search bar for name/email
3. Apply position filter
4. Apply status filter
5. Review filtered results

## 📞 Getting Help

For questions or issues:
1. Check this usage guide
2. Review the README.md file
3. Check the mock data in `/lib/mock-data.js`
4. Inspect browser console for errors

## 🎓 Learning Resources

### Understanding the Tech Stack
- **Next.js**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **React Query**: [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
- **Shadcn/ui**: [https://ui.shadcn.com](https://ui.shadcn.com)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

### Customization
- **Colors**: Edit `/app/globals.css`
- **Components**: Modify files in `/components/ui/`
- **Mock Data**: Update `/lib/mock-data.js`
- **Translations**: Edit `/lib/i18n.js`

---

**Need more features?** This is an MVP. You can extend it with:
- Real backend integration
- Database persistence
- Advanced AI features
- Report generation
- Email notifications
- Team collaboration tools
- Advanced analytics

Happy interviewing! 🎉

# 🔧 Troubleshooting Guide - Style Inspector Pro

## Current Issues & Solutions

### 1. **Dashboard Loading Issues**

**Problem**: Dashboard keeps spinning and never loads
**Cause**: You might be logged in with a real Supabase session that doesn't have proper profile/subscription data

**Solution**:
1. **Clear browser cache and cookies** for `localhost:5173`
2. **Hard refresh** the page (Ctrl+F5 or Cmd+Shift+R)
3. **Use Demo Login** instead of real authentication:
   - Go to `/auth`
   - Click "Demo Login (Instant Access)" button
   - This will sign you out of any real session and use demo data

### 2. **Console Errors Fixed**

✅ **CSP (Content Security Policy) errors** - Fixed with proper meta tag
✅ **React Router warnings** - Fixed with future flags
✅ **Font loading issues** - Fixed with CSP font-src directive

### 3. **Stripe Checkout Issues**

**Problem**: "Failed to start checkout. Please try again."
**Cause**: Stripe requires HTTPS in production, and some CSP issues

**Current Status**: 
- ✅ CSP fixed for Stripe
- ⚠️ Stripe checkout works in demo mode (no real billing)
- ⚠️ For real Stripe testing, you'll need HTTPS or use Stripe test mode

### 4. **Sign Out Issues**

**Problem**: Unable to sign out
**Solution**: 
- The sign out function has been updated
- Demo mode users: Sign out will clear demo session
- Real users: Sign out will clear Supabase session
- If stuck, clear browser storage manually

## 🚀 **Recommended Testing Flow**

### Step 1: Clear Everything
```bash
# Clear browser data for localhost:5173
# Or use incognito/private browsing mode
```

### Step 2: Use Demo Mode
1. Go to `http://localhost:5173/auth`
2. Click **"Demo Login (Instant Access)"**
3. You should be redirected to dashboard with:
   - User: John Doe
   - Plan: Pro
   - No loading issues

### Step 3: Test Extension Integration
1. Load extension in Chrome using `style-inspector-extension/dist` folder
2. Click extension icon to open side panel
3. Click "Sign In" in extension
4. Should open `http://localhost:5173/auth?mode=extension&state=...`
5. Complete authentication
6. Extension should receive token and unlock features

## 🔍 **Debug Console Errors**

### Current Clean Console (Expected):
```
✅ React DevTools suggestion (normal)
✅ Stripe HTTP warning (normal for localhost)
✅ Input autocomplete suggestion (minor)
```

### If You Still See Errors:
1. **Hard refresh** (Ctrl+F5)
2. **Clear browser cache**
3. **Check you're on** `http://localhost:5173` (not 5174)
4. **Use incognito mode** to test fresh

## 📋 **Environment Checklist**

- ✅ SaaS Platform: `http://localhost:5173`
- ✅ Extension Environment: Points to `localhost:5173`
- ✅ Extension Build: Successful
- ✅ CSP Headers: Properly configured
- ✅ Demo Mode: Working with Pro subscription

## 🆘 **If Problems Persist**

1. **Restart dev server**:
   ```bash
   # Kill current server
   pkill -f "vite"
   # Restart
   npm run dev
   ```

2. **Rebuild extension**:
   ```bash
   cd style-inspector-extension
   npm run build
   ```

3. **Use incognito mode** for testing

4. **Check browser console** for any new errors

## ✅ **Success Indicators**

- Dashboard loads immediately (no spinner)
- User shows as "John Doe" with Pro plan
- Sign out button works
- Extension can authenticate with SaaS platform
- Console shows only expected warnings
- Stripe integration works in demo mode

---

**Note**: The system is now configured for demo mode testing. For production deployment, you'll need to configure real Supabase credentials and Stripe keys.

const fs = require('fs');
const path = require('path');

const en = {
  "nav": {
    "home": "Home",
    "experts": "Experts",
    "profile": "Profile"
  },
  "common": {
    "no_internet": "No Internet Connection",
    "connecting": "Reconnecting..."
  },
  "profile": {
    "title": "Profile",
    "update_info": "Keep your information up to date",
    "name_label": "Name",
    "phone_label": "Phone Number",
    "email_label": "Email Address",
    "save_changes": "Save Changes",
    "my_bookings": "My Bookings",
    "payment_methods": "Payment Methods",
    "saved_addresses": "Saved Addresses",
    "app_settings": "App Settings",
    "help_support": "Help & Support",
    "privacy_security": "Privacy & Security",
    "about_app": "About App",
    "logout": "Logout",
    "logout_confirm_title": "Logout",
    "logout_confirm_msg": "Are you sure you want to logout?",
    "cancel": "Cancel",
    "language": "Language",
    "default_name": "Guest User",
    "guest_user": "Guest User",
    "login_to_access": "Login to access this feature",
    "login": "Login",
    "payments_soon": "Payments coming soon.",
    "addresses_soon": "Addresses coming soon.",
    "settings_soon": "Settings coming soon.",
    "support_contact": "Contacting support...",
    "profile_updated": "Profile Updated",
    "profile_saved": "Your profile has been saved successfully.",
    "privacy_details": "Privacy details..."
  }
};

const ta = {
  "nav": {
    "home": "\u0bae\u0bc1\u0b95\u0baa\u0bcd\u0baa\u0bc1",
    "experts": "\u0ba8\u0bbf\u0baa\u0bc1\u0ba3\u0bb0\u0bcd\u0b95\u0bb3\u0bcd",
    "profile": "\u0b9a\u0bc1\u0baf\u0bb5\u0bbf\u0bb5\u0bb0\u0bae\u0bcd"
  },
  "common": {
    "no_internet": "\u0b87\u0ba3\u0bc8\u0baf \u0ba4\u0bca\u0b9f\u0bb0\u0bcd\u0baa\u0bc1 \u0b87\u0bb2\u0bcd\u0bb2\u0bc8",
    "connecting": "\u0bae\u0bc0\u0ba3\u0bcd\u0b9f\u0bc1\u0bae\u0bcd \u0b87\u0ba3\u0bc8\u0b95\u0bcd\u0b95\u0bbf\u0bb1\u0ba4\u0bc1..."
  },
  "profile": {
    "title": "\u0b9a\u0bc1\u0baf\u0bb5\u0bbf\u0bb5\u0bb0\u0bae\u0bcd",
    "update_info": "\u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0ba4\u0b95\u0bb5\u0bb2\u0bcd\u0b95\u0bb3\u0bc8 \u0baa\u0bc1\u0ba4\u0bc1\u0baa\u0bcd\u0baa\u0bbf\u0ba4\u0bcd\u0ba4\u0bc1 \u0bb5\u0bc8\u0ba4\u0bcd\u0ba4\u0bbf\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd",
    "name_label": "\u0baa\u0bc6\u0baf\u0bb0\u0bcd",
    "phone_label": "\u0ba4\u0bca\u0bb2\u0bc8\u0baa\u0bc7\u0b9a\u0bbf \u0b8e\u0ba3\u0bcd",
    "email_label": "\u0bae\u0bbf\u0ba9\u0bcd\u0ba9\u0b9e\u0bcd\u0b9a\u0bb2\u0bcd \u0bae\u0bc1\u0b95\u0bb5\u0bb0\u0bbf",
    "save_changes": "\u0bae\u0bbe\u0bb1\u0bcd\u0bb1\u0b99\u0bcd\u0b95\u0bb3\u0bc8 \u0b9a\u0bc7\u0bae\u0bbf",
    "my_bookings": "\u0b8e\u0ba9\u0ba4\u0bc1 \u0baa\u0ba4\u0bbf\u0bb5\u0bc1\u0b95\u0bb3\u0bcd",
    "payment_methods": "\u0b95\u0b9f\u0bcd\u0b9f\u0ba3 \u0bae\u0bc1\u0bb1\u0bc8\u0b95\u0bb3\u0bcd",
    "saved_addresses": "\u0b9a\u0bc7\u0bae\u0bbf\u0b95\u0bcd\u0b95\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f \u0bae\u0bc1\u0b95\u0bb5\u0bb0\u0bbf\u0b95\u0bb3\u0bcd",
    "app_settings": "\u0baa\u0baf\u0ba9\u0bcd\u0baa\u0bbe\u0b9f\u0bc1 \u0b85\u0bae\u0bc8\u0baa\u0bcd\u0baa\u0bc1\u0b95\u0bb3\u0bcd",
    "help_support": "\u0b89\u0ba4\u0bb5\u0bbf & \u0b86\u0ba4\u0bb0\u0bb5\u0bc1",
    "privacy_security": "\u0bb0\u0b95\u0b9a\u0bbf\u0baf\u0bae\u0bcd & \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1",
    "about_app": "\u0baa\u0baf\u0ba9\u0bcd\u0baa\u0bbe\u0b9f\u0bc1 \u0baa\u0bb1\u0bcd\u0bb1\u0bbf",
    "logout": "\u0bb5\u0bc6\u0bb3\u0bbf\u0baf\u0bc7\u0bb1\u0bc1",
    "logout_confirm_title": "\u0bb5\u0bc6\u0bb3\u0bbf\u0baf\u0bc7\u0bb1\u0bc1",
    "logout_confirm_msg": "\u0ba8\u0bc0\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b89\u0bb1\u0bc1\u0ba4\u0bbf\u0baf\u0bbe\u0b95 \u0bb5\u0bc6\u0bb3\u0bbf\u0baf\u0bc7\u0bb1 \u0bb5\u0bbf\u0bb0\u0bc1\u0bae\u0bcd\u0baa\u0bc1\u0b95\u0bbf\u0bb1\u0bc0\u0bb0\u0bcd\u0b95\u0bb3\u0bbe?",
    "cancel": "\u0bb0\u0ba4\u0bcd\u0ba4\u0bc1 \u0b9a\u0bc6\u0baf\u0bcd",
    "language": "\u0bae\u0bca\u0bb4\u0bbf",
    "default_name": "\u0bb5\u0bbf\u0bb0\u0bc1\u0ba8\u0bcd\u0ba4\u0bbf\u0ba9\u0bb0\u0bcd",
    "guest_user": "\u0bb5\u0bbf\u0bb0\u0bc1\u0ba8\u0bcd\u0ba4\u0bbf\u0ba9\u0bb0\u0bcd",
    "login_to_access": "\u0b87\u0ba4\u0bc8 \u0b85\u0ba3\u0bc1\u0b95 \u0b89\u0bb3\u0bcd\u0ba8\u0bc1\u0bb4\u0bc8\u0baf\u0bb5\u0bc1\u0bae\u0bcd",
    "login": "\u0b89\u0bb3\u0bcd\u0ba8\u0bc1\u0bb4\u0bc8",
    "payments_soon": "\u0b95\u0b9f\u0bcd\u0b9f\u0ba3\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0bb5\u0bbf\u0bb0\u0bc8\u0bb5\u0bbf\u0bb2\u0bcd.",
    "addresses_soon": "\u0bae\u0bc1\u0b95\u0bb5\u0bb0\u0bbf\u0b95\u0bb3\u0bcd \u0bb5\u0bbf\u0bb0\u0bc8\u0bb5\u0bbf\u0bb2\u0bcd.",
    "settings_soon": "\u0b85\u0bae\u0bc8\u0baa\u0bcd\u0baa\u0bc1\u0b95\u0bb3\u0bcd \u0bb5\u0bbf\u0bb0\u0bc8\u0bb5\u0bbf\u0bb2\u0bcd.",
    "support_contact": "\u0b86\u0ba4\u0bb0\u0bb5\u0bc8 \u0ba4\u0bca\u0b9f\u0bb0\u0bcd\u0baa\u0bc1 \u0b95\u0bca\u0bb3\u0bcd\u0b95\u0bbf\u0bb1\u0ba4\u0bc1...",
    "profile_updated": "\u0b9a\u0bc1\u0baf\u0bb5\u0bbf\u0bb5\u0bb0\u0bae\u0bcd \u0baa\u0bc1\u0ba4\u0bc1\u0baa\u0bcd\u0baa\u0bbf\u0b95\u0bcd\u0b95\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f\u0ba4\u0bc1",
    "profile_saved": "\u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b9a\u0bc1\u0baf\u0bb5\u0bbf\u0bb5\u0bb0\u0bae\u0bcd \u0bb5\u0bc6\u0bb1\u0bcd\u0bb1\u0bbf\u0b95\u0bb0\u0bae\u0bbe\u0b95 \u0b9a\u0bc7\u0bae\u0bbf\u0b95\u0bcd\u0b95\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f\u0ba4\u0bc1.",
    "privacy_details": "\u0bb0\u0b95\u0b9a\u0bbf\u0baf \u0bb5\u0bbf\u0bb5\u0bb0\u0b99\u0bcd\u0b95\u0bb3\u0bcd..."
  },
  "language_selection": {
    "title": "Choose Your\nLanguage",
    "subtitle": "Select your preferred language to personalize your experience",
    "english": "English",
    "english_desc": "For a global experience",
    "tamil": "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd",
    "tamil_desc": "\u0b89\u0bb3\u0bcd\u0bb3\u0bc2\u0bb0\u0bcd \u0bae\u0bca\u0bb4\u0bbf",
    "thanglish": "Thanglish",
    "thanglish_desc": "\u0b86\u0b99\u0bcd\u0b95\u0bbf\u0bb2\u0bae\u0bcd & \u0ba4\u0bae\u0bbf\u0bb4\u0bcd",
    "change_later": "You can change this later in settings"
  }
};

const enJsonPath = path.join(__dirname, 'src', 'i18n', 'locales', 'en.json');
const taJsonPath = path.join(__dirname, 'src', 'i18n', 'locales', 'ta.json');

// Read the existing files to keep other objects, just replace what's needed, or recreate completely.
// But we should just rewrite the whole file, merging with what's there
let existingEn = {};
let existingTa = {};
try { existingEn = JSON.parse(fs.readFileSync(enJsonPath, 'utf8')); } catch (e) {}
try { existingTa = JSON.parse(fs.readFileSync(taJsonPath, 'utf8')); } catch (e) {}

const mergedEn = { ...existingEn, nav: en.nav, common: en.common, profile: en.profile, language_selection: en.language_selection };
const mergedTa = { ...existingTa, nav: ta.nav, common: ta.common, profile: ta.profile, language_selection: ta.language_selection };

fs.writeFileSync(enJsonPath, JSON.stringify(mergedEn, null, 2), 'utf8');
fs.writeFileSync(taJsonPath, JSON.stringify(mergedTa, null, 2), 'utf8');
console.log('Fixed locales');

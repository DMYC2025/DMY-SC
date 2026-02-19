# New Update - Features & Changes
# නව යාවත්කාලීන - විශේෂාංග සහ වෙනස්කම්

This update focuses on enhancing the user experience for our mobile and web application users.
මෙම යාවත්කාලීන කිරීම අපගේ ජංගම සහ වෙබ් යෙදුම් පරිශීලකයින් සඳහා අත්දැකීම් වැඩිදියුණු කිරීම කෙරෙහි අවධානය යොමු කරයි.

---

## 1. "Report Issue" Feature
## 1. ගැටළු වාර්තා කිරීමේ පහසුකම ("Report Issue")

### English
*   **Accessible Everywhere:** Added a "Report Issue" button to the top navigation bar, visible on both PC and Mobile devices.
*   **Mobile-Optimized:** Inserted a large, easy-to-tap "Report Issue" button directly into the main menu list on mobile (between the Quick Links grid and the Slideshow).
*   **Smart Form:** Created a new Report Modal. It automatically pre-fills your Name, Club ID, Email, and WhatsApp number, so you only need to type your issue description.

### සිංහල
*   **සෑම තැනකම:** Mobile සහ PC යන දෙකෙහිම ඉහළ තීරුවේ (Header) පහසුවෙන් පෙනෙන පරිදි "Report Issue" බටන් එකක් එක් කරන ලදී.
*   **ජංගම දුරකථන සඳහා:** ජංගම දුරකථන මෙනු ලැයිස්තුවේ (Quick Links සහ Slideshow අතර) විශාල සහ පහසුවෙන් ටැප් කළ හැකි "Report Issue" බටන් එකක් එක් කරන ලදී.
*   **ස්වයංක්‍රීය පෝරමය:** අලුතින් Report Modal එකක් සකසන ලදී. එහි ඔබගේ නම, Club ID, සහ දුරකථන අංක ඉබේම පිරවෙන (Auto-fill) නිසා, ඔබට ඇත්තේ ගැටළුව පමණක් ලිවීමටයි.

---

## 2. App Installation & PWA Shortcuts
## 2. App ස්ථාපනය සහ කෙටිමං (PWA)

### English
*   **Direct Dashboard Access:** Changed the App Manifest so that when you install the app on your phone (Add to Home Screen), it launches directly into the **User Dashboard** (`user/index.html`) instead of the public landing page.
*   **Instant Updates:** Updated the Service Worker (`sw.js`) to version 2 (`dmysc-v2`) to ensure these changes take effect immediately on your devices.

### සිංහල
*   **කෙලින්ම Dashboard එකට:** ඔබ මෙම App එක Phone එකට Install කළ විට (Add to Home Screen), එය විවෘත වන්නේ කෙලින්ම **User Dashboard (`user/index.html`)** එකටය. තවදුරටත් පොදු මුල් පිටුවට (Home page) නොයයි.
*   **ක්ෂණික යාවත්කාලීන:** මෙම අලුත් කිරීම් වහාම ඔබගේ දුරකථනවලට ලැබීම සඳහා Service Worker එක (`sw.js`) version 2 (`dmysc-v2`) ලෙස යාවත්කාලීන කරන ලදී.

---

## 3. Smart Redirection (Auto-Login)
## 3. ස්වයංක්‍රීය පිවිසුම් යොමු කිරීම් (Smart Redirection)

### English
*   **Landing Page Logic:** If a user visits the main website (`index.html`) and is already logged in, they are automatically redirected to their personal Dashboard.
*   **Secure Shortcuts:** If a user opens the app from their Home Screen shortcut but is *not* logged in, they are immediately redirected to the **Login Page** (`up and in/login.html`) to sign in securely.
*   **Dashboard Security:** Added a security check to the Dashboard itself. If anyone tries to access it without logging in, they are bounced back to the Login page.

### සිංහල
*   **මුල් පිටුව:** ඔබ වෙබ් අඩවියේ මුල් පිටුවට (`index.html`) පිවිසෙන විට දැනටමත් Log වී ඇත්නම්, ඔබව ස්වයංක්‍රීයව ඔබගේ Dashboard එකට යොමු කෙරේ.
*   **ආරක්ෂිත කෙටිමං:** ඔබ Phone එකේ Home Screen එකෙන් App එක විවෘත කරන විට Log වී නැත්නම්, ඔබව කෙලින්ම **Login Page** (`up and in/login.html`) වෙත යොමු කෙරේ.
*   **Dashboard ආරක්ෂාව:** Dashboard එකට ආරක්ෂිත පරීක්ෂණයක් (Check) එක් කරන ලදී. Log නොවී Dashboard එකට යාමට උත්සාහ කළහොත්, ස්වයංක්‍රීයව නැවත Login Page එකට හරවා යවනු ලැබේ.

<img width="1024" height="1024" alt="ChatGPT Image Nov 23, 2025, 11_29_21 PM" src="https://github.com/user-attachments/assets/ccb2a4d0-fa25-4690-9d68-40fd2f6e9e00" />

🍔 BRGRR – Burger Ordering Web Application

BRGRR is a modern, responsive, and interactive burger-building web app made using HTML, CSS, and JavaScript.
It offers a realistic food-ordering experience with live customization, favorites, validation, animations, and session-based order history.

✨ Features Overview (Mapped to Parts I–V)
🧱 Part I – Structure & DOM Foundations

Semantic and clean HTML layout.

Burger customizer built with bun selector, dynamic toppings, quantity input.

Toppings created using JavaScript (no hardcoded HTML buttons).

🎨 Part II – Responsive UI, Styling & Animations

Fully responsive layout for all screen sizes.

Soft gradients, rounded cards, and subtle shadows.

Smooth transitions:

Topping “add” flash

Item drop animation

Button press effects

Sticky checkout summary on desktops.

⚙ Part III – JavaScript Interactivity

Click toppings to add → instantly appears in the live list.

Click list items to remove them.

Real-time price calculation (bun + toppings + quantity).

Conditional UI:

Checkout disabled until required selections are made.

Bun selector locks after checkout until order is confirmed.

💾 Part IV – Storage Integration
⭐ localStorage

Save your favorite burger combinations.

Instantly reapply saved favorites.

Data stays even after page reload or browser restart.

🕒 sessionStorage

Simulated login (“Welcome, Alex” style).

Session-only order history (clears on closing the tab).

Quick action buttons to rebuild previous session orders.

🧪 Part V – Validation, UX Feedback & Final Polish

Bun selection is required (real-time success/error feedback).

Requires at least one topping before checkout.

Clear messages without alert pop-ups.

Checkout summary includes:

Bun type

Toppings list

Quantity

Total price

Smooth order confirmation animation.

Clean, modular, and well-commented code.

🛠 Technologies Used

HTML5

CSS3

Vanilla JavaScript (ES6)

localStorage API

sessionStorage API

📁 Project Structure
BRGRR-App/
│── index.html
│── README.md
│── css/
│    └── style.css
│── js/
│    └── script.js
└── images/   (optional)

▶ How to Run

Download the project folder.

Open index.html in your browser.

No installation or server needed.

✅ Quality Checklist

No console errors

Toppings add/remove correctly

Price updates live

Favorites saved + restored properly

Login simulation works

Session history stays active

Accurate checkout summary

Fully responsive design

Code is clean & commented

🚧 Known Issues / Future Enhancements

Add images/icons for toppings

Improve accessibility (ARIA, keyboard navigation)

Add simple payment simulation

Add order tracking or progress bar

Multi-favorite slots with thumbnails

🚀 Deployment

Can be hosted easily using:

GitHub Pages

Netlify

Vercel

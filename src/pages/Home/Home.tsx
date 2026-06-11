import { useState } from "react";
import { Link } from "react-router-dom";

const branches = [
  {
    branchId: 1,
    name: "Steakz London Central",
    location: "London Central",
    tables: "4 Tables",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    branchId: 2,
    name: "Steakz Manchester",
    location: "Manchester",
    tables: "5 Tables",
    img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    branchId: 3,
    name: "Steakz Liverpool",
    location: "Liverpool",
    tables: "5 Tables",
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
  },
  {
    branchId: 4,
    name: "Steakz Birmingham",
    location: "Birmingham",
    tables: "5 Tables",
    img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    branchId: 5,
    name: "Steakz Leeds",
    location: "Leeds",
    tables: "5 Tables",
    img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    branchId: 6,
    name: "Steakz Bristol",
    location: "Bristol",
    tables: "5 Tables",
    img: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    branchId: 7,
    name: "Steakz Glasgow",
    location: "Glasgow",
    tables: "5 Tables",
    img: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=1200&q=80",
  },
];

const promotions = [
  {
    title: "Steak Night Deal",
    text: "Enjoy 20% off selected premium steaks every Wednesday.",
    badge: "20% OFF",
  },
  {
    title: "Burger Combo",
    text: "Classic burger, fries and soft drink from £14.99.",
    badge: "COMBO",
  },
  {
    title: "Dessert Special",
    text: "Add any dessert to your meal for only £4.99.",
    badge: "SPECIAL",
  },
];

const featuredMenu = [
  {
    category: "Steaks",
    name: "T-Bone Steak",
    price: "£29.99",
    text: "Premium grilled T-Bone steak served with herbs and garlic butter.",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "Steaks",
    name: "Ribeye Steak",
    price: "£27.99",
    text: "Juicy ribeye steak with a rich smoky steakhouse finish.",
    img: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "Steaks",
    name: "Sirloin Steak",
    price: "£23.99",
    text: "Tender sirloin steak prepared with our signature seasoning.",
    img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "Steaks",
    name: "Filet Mignon",
    price: "£34.99",
    text: "The most tender premium steak, cooked to perfection.",
    img: "https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "Burgers",
    name: "Classic Burger",
    price: "£11.99",
    text: "Premium beef burger with cheddar, lettuce and steakhouse sauce.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "Burgers",
    name: "Double Cheese Burger",
    price: "£13.99",
    text: "Double beef patty loaded with melted cheddar cheese.",
    img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "Burgers",
    name: "BBQ Bacon Burger",
    price: "£14.99",
    text: "Smoky BBQ sauce, crispy bacon and premium beef.",
    img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "Sides",
    name: "Garlic Bread",
    price: "£4.99",
    text: "Toasted garlic bread with herbs and melted butter.",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "Sides",
    name: "French Fries",
    price: "£3.99",
    text: "Golden crispy fries served with steakhouse seasoning.",
    img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "Sides",
    name: "Onion Rings",
    price: "£4.49",
    text: "Crunchy onion rings fried until golden brown.",
    img: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "Desserts",
    name: "Chocolate Cake",
    price: "£6.99",
    text: "Rich chocolate dessert made for steakhouse lovers.",
    img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "Desserts",
    name: "Cheesecake",
    price: "£5.99",
    text: "Creamy New York cheesecake with berry topping.",
    img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "Desserts",
    name: "Chocolate Brownie",
    price: "£5.49",
    text: "Warm chocolate brownie served with chocolate drizzle.",
    img: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?auto=format&fit=crop&w=600&q=80",
  },
];

const categories = [
  {
    name: "Steaks",
    img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Burgers",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sides",
    img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Desserts",
    img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80",
  },
];

function Home() {
  const [activeCategory, setActiveCategory] = useState("Steaks");

  const filteredMenu = featuredMenu.filter(
    (item) => item.category === activeCategory
  );

  return (
    <div className="public-home">
      <header className="public-navbar">
        <div className="public-logo">
          <span>🥩</span>
          <h2>Steakz</h2>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#branches">Branches</a>
          <a href="#menu">Menu</a>
          <a href="#promotions">Promotions</a>
        </nav>

        <Link to="/login" className="nav-login-btn">
          Staff Login
        </Link>
      </header>

      <section id="home" className="public-hero steakz-hero">
        <div className="hero-content">
          <p className="section-label">Premium Multi-Branch Steakhouse</p>

          <h1>
            Steakz Dining,
            <br />
            Managed With Precision
          </h1>

          <p className="hero-text">
            Enjoy premium steaks, signature meals and elegant restaurant spaces
            across every Steakz branch.
          </p>

          <div className="hero-actions">
            <a href="#menu" className="primary-public-btn">
              View Menu →
            </a>

            <a href="#promotions" className="secondary-public-btn">
              View Promotions
            </a>
          </div>
        </div>

        <div className="hero-circle-card">
          <div className="circle-main">
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80"
              alt="Steakz restaurant interior"
            />
          </div>

          <div className="circle-small circle-one">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80"
              alt="Premium steak"
            />
          </div>

          <div className="circle-small circle-two">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
              alt="Steakz burger"
            />
          </div>
        </div>
      </section>

      <section id="branches" className="public-section branches-section">
        <p className="section-label center">Our Branches</p>

        <h2 className="public-title">
          View Steakz Branches Across The <span>United Kingdom</span>
        </h2>

        <div className="branch-grid">
          {branches.map((branch) => (
            <div className="branch-card branch-photo-card" key={branch.name}>
              <img src={branch.img} alt={branch.name} />

              <div className="branch-card-overlay">
                <span>📍</span>
                <h3>{branch.name}</h3>
                <p>{branch.location}</p>
                <small>{branch.tables}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="category-section">
        <p className="section-label center">Menu Categories</p>

        <h2 className="public-title">
          Explore Our <span>Signature Choices</span>
        </h2>

        <div className="category-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.name}>
              <img src={category.img} alt={category.name} />
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section id="menu" className="public-section">
        <p className="section-label center">View Menu</p>

        <h2 className="public-title">
          A Menu Inspired By Premium <span>Flavour</span>
        </h2>

        <div className="menu-tabs">
          {["Steaks", "Burgers", "Sides", "Desserts"].map((category) => (
            <button
              key={category}
              className={activeCategory === category ? "active-tab" : ""}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filteredMenu.map((item) => (
            <div className="menu-item-card" key={item.name}>
              <img src={item.img} alt={item.name} />

              <div>
                <div className="menu-item-head">
                  <h3>{item.name}</h3>
                  <span>{item.price}</span>
                </div>

                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="promotions" className="public-section promotions-section">
        <p className="section-label center">View Promotions</p>

        <h2 className="public-title">
          Current Steakz <span>Promotions</span>
        </h2>

        <div className="promo-grid">
          {promotions.map((promotion) => (
            <div className="promo-card" key={promotion.title}>
              <span>{promotion.badge}</span>
              <h3>{promotion.title}</h3>
              <p>{promotion.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="public-footer">
        <div>
          <div className="public-logo">
            <span>🥩</span>
            <h2>Steakz</h2>
          </div>

          <p>123 Steakz London Central, United Kingdom</p>
          <p>+44 123 456 7890</p>
          <p>info@steakz.com</p>
        </div>

        <div>
          <h3>Customer Access</h3>
          <p>View Menu • View Promotions • View Branches</p>
        </div>

        <p>© 2025 Steakz. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
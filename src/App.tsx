import { useState, useMemo, useEffect } from "react";
import { COFFEES, CURATOR_COFFEES, FARM_STORIES, DEFAULT_FILTERS, ORDER_STATUSES } from "./data";
import {
  STORAGE, load,
  filtersAreDefault, findPlan,
  addItemToCart, setCartQty, decrementStock,
  makeStarterCoffees, makeDemoOrders,
} from "./lib";
import type { CartItem, Coffee, Customer, FincaEntity, Order, Review, Seller, Subscription, Toast as ToastData } from "./types";
import { Toast } from "./components/atoms";
import { BottomNav, FiltersPanel, SearchBar, SideMenu, TopBar } from "./components/chrome";
import { CatalogScreen, HomeScreen, ProductDetail } from "./components/coffee";
import { FarmProfile, FarmsScreen } from "./components/farms";
import { SubscriptionPanel } from "./components/buyer";
import { CoffeeForm, ProfileScreen } from "./components/seller";
import { CartView } from "./components/cart";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => load(STORAGE.cart, []));
  const [activeCat, setActiveCat] = useState("Todos");
  const [openCoffee, setOpenCoffee] = useState<Coffee | null>(null);
  const [openFarm, setOpenFarm] = useState<FincaEntity | null>(null);
  const [editingCoffee, setEditingCoffee] = useState<Coffee | "new" | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  const [seller, setSeller] = useState<Seller | null>(() => load(STORAGE.seller, null));
  const [sellerCoffees, setSellerCoffees] = useState<Coffee[]>(() => load(STORAGE.coffees, []));
  const [orders, setOrders] = useState<Order[]>(() => load(STORAGE.orders, []));
  const [favorites, setFavorites] = useState<string[]>(() => load(STORAGE.favorites, []));
  const [customer, setCustomer] = useState<Customer | null>(() => load(STORAGE.customer, null));
  const [reviews, setReviews] = useState<Review[]>(() => load(STORAGE.reviews, []));
  const [subscription, setSubscription] = useState<Subscription | null>(() => load(STORAGE.subscription, null));
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Búsqueda, filtros y toast (no persistidos)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState<ToastData>(null);
  const showToast = (text: string) => setToast({ id: Date.now() + Math.random(), text });

  useEffect(() => { localStorage.setItem(STORAGE.seller, JSON.stringify(seller)); }, [seller]);
  useEffect(() => { localStorage.setItem(STORAGE.coffees, JSON.stringify(sellerCoffees)); }, [sellerCoffees]);
  useEffect(() => { localStorage.setItem(STORAGE.orders, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(STORAGE.cart, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(STORAGE.favorites, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem(STORAGE.customer, JSON.stringify(customer)); }, [customer]);
  useEffect(() => { localStorage.setItem(STORAGE.reviews, JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem(STORAGE.subscription, JSON.stringify(subscription)); }, [subscription]);

  // Los cafés en borrador no aparecen en el marketplace
  const allCoffees = useMemo(() => [...sellerCoffees.filter(c => !c.draft), ...CURATOR_COFFEES, ...COFFEES], [sellerCoffees]);

  const filtered = useMemo(() => {
    let list = allCoffees;
    if (activeCat === "Favoritos") list = list.filter(c => favorites.includes(c.id));
    else if (activeCat === "Microlotes") list = list.filter(c => c.micro);
    else if (activeCat === "Comercio justo") list = list.filter(c => c.fairtrade);
    else if (activeCat === "Tueste a pedido") list = list.filter(c => (c.fresh || "").includes("pedido"));
    else if (activeCat === "Mujeres caficultoras") list = list.filter(c => /mar[ií]a|asomucaf|mujer/i.test(`${c.farmer} ${c.farm}`));
    else if (activeCat === "Anaeróbicos") list = list.filter(c => (c.process || "").toLowerCase().includes("anaer"));
    const q = searchQuery.trim().toLowerCase();
    if (q) list = list.filter(c => `${c.name} ${c.farmer} ${c.farm} ${c.region} ${c.variety} ${(c.notes || []).join(' ')}`.toLowerCase().includes(q));
    if (filters.priceMin > 0) list = list.filter(c => c.price >= filters.priceMin);
    if (filters.priceMax > 0) list = list.filter(c => c.price <= filters.priceMax);
    if (filters.scoreMin > 0) list = list.filter(c => (c.score || 0) >= filters.scoreMin);
    if (filters.roasts.length) list = list.filter(c => filters.roasts.includes(c.roast));
    if (filters.onlyMicro) list = list.filter(c => c.micro);
    if (filters.onlyFairtrade) list = list.filter(c => c.fairtrade);
    return list;
  }, [activeCat, allCoffees, searchQuery, filters, favorites]);

  const hasActiveFilters = !filtersAreDefault(filters);
  const clearAll = () => { setSearchQuery(""); setFilters(DEFAULT_FILTERS); setActiveCat("Todos"); setSearchOpen(false); };
  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const had = prev.includes(id);
      showToast(had ? "Quitado de favoritos" : "Añadido a favoritos");
      return had ? prev.filter(x => x !== id) : [...prev, id];
    });
  };

  const sellerRole = seller ? (seller.role || "productor") : null;
  const sellerEntity: FincaEntity | null = useMemo(() => seller ? { name: seller.fincaName, farmer: seller.farmerName, region: seller.region, altitude: seller.altitude, story: seller.story, certifications: seller.certifications || [], coffees: sellerCoffees.filter(c => !c.draft), isSeller: true, verified: !!seller.verified, joined: seller.joined, kind: sellerRole === "curador" ? "curador" : "finca", logoUrl: seller.logoUrl } : null, [seller, sellerCoffees, sellerRole]);

  const producerFincas = useMemo(() => {
    const map = new Map<string, FincaEntity>();
    COFFEES.forEach(c => {
      if (!map.has(c.farm)) map.set(c.farm, { name: c.farm, farmer: c.farmer, region: c.region, altitude: c.altitude, story: FARM_STORIES[c.farm], coffees: [], isSeller: false, kind: "finca", verified: !!c.verified, certifications: c.fairtrade ? ["Comercio Justo"] : [] });
      map.get(c.farm).coffees.push(c);
    });
    const arr = [...map.values()];
    if (sellerEntity && sellerEntity.kind === "finca") arr.unshift(sellerEntity);
    return arr;
  }, [sellerEntity]);

  const curatorBrands = useMemo(() => {
    const map = new Map<string, FincaEntity>();
    CURATOR_COFFEES.forEach(c => {
      if (!map.has(c.brand)) map.set(c.brand, { name: c.brand, farmer: c.curator, region: c.city, altitude: c.credential, story: c.bio, coffees: [], isSeller: false, kind: "curador", verified: !!c.verified, certifications: [c.credential].filter(Boolean) });
      map.get(c.brand).coffees.push(c);
    });
    const arr = [...map.values()];
    if (sellerEntity && sellerEntity.kind === "curador") arr.unshift(sellerEntity);
    return arr;
  }, [sellerEntity]);

  const allEntities = useMemo(() => [...producerFincas, ...curatorBrands], [producerFincas, curatorBrands]);

  const addToCart = (coffee: Coffee | CartItem) => {
    const { cart: next, added } = addItemToCart(cart, coffee);
    setCart(next);
    showToast(added > 0 ? `Añadido: ${coffee.name}` : `Sin stock disponible de ${coffee.name}`);
  };
  const removeFromCart = (idx: number) => setCart(prev => prev.filter((_, i) => i !== idx));
  const updateQty = (idx: number, qty: number) => setCart(prev => setCartQty(prev, idx, qty));
  const cartCount = cart.reduce((s, i) => s + (i.qty || 1), 0);

  const handleCheckout = (data) => {
    const subtotal = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
    const items = cart.map(it => ({ id: it.id, name: it.name, farm: it.farm, price: it.price, qty: it.qty || 1, grind: it.grind, bySeller: !!it.bySeller, sellerId: it.sellerId }));
    const shippingCost = data?.shipping ?? 12000;
    const order: Order = {
      id: "o_" + Date.now(),
      date: new Date().toISOString(),
      customer: data?.customer || { name: "Cliente", city: "Bogotá" },
      items, subtotal,
      shipping: shippingCost,
      total: subtotal + shippingCost,
      status: "Nuevo",
      byUser: true,
      shippingMethod: data?.shippingMethod || "standard",
      paymentMethod: data?.paymentMethod || "card",
      notes: data?.notes || "",
    };
    setOrders(prev => [order, ...prev]);
    // Decrementar stock de cafés del vendedor
    setSellerCoffees(prev => decrementStock(prev, cart));
    setCart([]);
    if (data?.customer) {
      setCustomer({ ...data.customer, shippingId: data.shippingMethod, paymentId: data.paymentMethod });
    }
    return order;
  };

  const registerSeller = (data) => {
    const newSeller: Seller = { id: "seller_local", ...data, verified: false, joined: new Date().toISOString() };
    const starters = makeStarterCoffees(newSeller);
    setSeller(newSeller);
    setSellerCoffees(starters);
    setOrders(prev => [...makeDemoOrders(starters), ...prev]);
  };
  const requestVerification = () => {
    showToast("Solicitud enviada — revisamos tu perfil");
    setTimeout(() => {
      setSeller(prev => prev ? { ...prev, verified: true } : prev);
      showToast("¡Estás verificado!");
    }, 1500);
  };
  const saveCoffee = (coffee: Coffee) => {
    setSellerCoffees(prev => prev.some(c => c.id === coffee.id) ? prev.map(c => c.id === coffee.id ? coffee : c) : [coffee, ...prev]);
    setEditingCoffee(null);
  };
  const deleteCoffee = (id: string) => setSellerCoffees(prev => prev.filter(c => c.id !== id));
  const advanceOrder = (orderId: string) => setOrders(prev => prev.map(o => {
    if (o.id !== orderId) return o;
    const i = ORDER_STATUSES.indexOf(o.status);
    return { ...o, status: ORDER_STATUSES[Math.min(i + 1, ORDER_STATUSES.length - 1)] };
  }));
  const updateSeller = (data: Partial<Seller>) => {
    setSeller(prev => ({ ...prev, ...data }));
    // Si cambió el logo, re-estampa la marca en los cafés del vendedor
    if ("logoUrl" in data) setSellerCoffees(prev => prev.map(c => c.bySeller ? { ...c, brandLogo: data.logoUrl || "" } : c));
  };
  const addReview = (data: Partial<Review>) => {
    setReviews(prev => [{ id: "r_" + Date.now(), date: new Date().toISOString(), ...data } as Review, ...prev]);
    showToast("¡Gracias por tu reseña!");
  };
  const subscribeTo = (planId: string) => {
    setSubscription({ planId, startDate: new Date().toISOString() });
    setSubscribeOpen(false);
    const plan = findPlan(planId);
    showToast(`Suscripción ${plan?.name} activada`);
  };
  const unsubscribe = () => { setSubscription(null); showToast("Suscripción cancelada"); };
  const resetSeller = () => {
    setSeller(null);
    setSellerCoffees([]);
    // Quita los pedidos demo y desvincula del vendedor cerrado los items de pedidos reales
    setOrders(prev => prev
      .filter(o => o.byUser)
      .map(o => ({ ...o, items: o.items.map(({ bySeller, sellerId, ...rest }) => rest) })));
  };
  const openFarmByName = (name: string) => { const f = allEntities.find(x => x.name === name); if (f) { setOpenCoffee(null); setOpenFarm(f); } };

  return (
    <div className="flex flex-col items-center min-h-screen bg-black sm:py-5 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* Marco "teléfono" en desktop · pantalla completa en mobile */}
      <div className="w-full h-screen sm:w-[390px] sm:h-[844px] sm:rounded-[48px] sm:shadow-[0_40px_120px_rgba(0,0,0,0.8)] bg-page overflow-hidden relative flex flex-col">
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-b-[20px] z-[100]"/>
        <div className="hidden sm:block h-[47px] shrink-0"/>

        <TopBar cartCount={cartCount} onCart={() => setCartOpen(true)} onMenu={() => setMenuOpen(true)} onSearch={() => { if (!searchOpen && activeNav === "home") setActiveNav("shop"); setSearchOpen(o => !o); }}/>
        {searchOpen && <SearchBar value={searchQuery} onChange={setSearchQuery} onClose={() => { setSearchQuery(""); setSearchOpen(false); }}/>}

        <div className="flex-1 overflow-y-auto [scrollbar-width:none]">
          {activeNav === "home" && <HomeScreen onExplore={() => setActiveNav("shop")} onFarms={() => setActiveNav("farms")} onCurators={() => setActiveNav("curators")}/>}
          {activeNav === "shop" && <CatalogScreen coffees={filtered} activeCat={activeCat} setActiveCat={setActiveCat} onAdd={addToCart} onOpen={setOpenCoffee} favorites={favorites} onToggleFav={toggleFav} onOpenFilters={() => setFiltersOpen(true)} hasActiveFilters={hasActiveFilters || !!searchQuery} onClearAll={clearAll}/>}
          {activeNav === "farms" && <FarmsScreen fincas={producerFincas} onOpenFarm={openFarmByName} kicker="ORIGEN" title={`${producerFincas.length} fincas`}/>}
          {activeNav === "curators" && <FarmsScreen fincas={curatorBrands} onOpenFarm={openFarmByName} kicker="MARCAS" title={`${curatorBrands.length} tostadores`}/>}
          {activeNav === "profile" && <ProfileScreen seller={seller} coffees={sellerCoffees} orders={orders} customer={customer} subscription={subscription} onSubscribeOpen={() => setSubscribeOpen(true)} onUnsubscribe={unsubscribe} onRegister={registerSeller} onNewCoffee={() => setEditingCoffee("new")} onEditCoffee={setEditingCoffee} onDeleteCoffee={deleteCoffee} onAdvanceOrder={advanceOrder} onUpdateSeller={updateSeller} onOpenFarm={openFarmByName} onReset={resetSeller} onRequestVerification={requestVerification}/>}
        </div>

        <BottomNav active={activeNav} setActive={setActiveNav}/>

        {openCoffee && <ProductDetail coffee={openCoffee} onBack={() => setOpenCoffee(null)} onAdd={addToCart} onOpenFarm={openFarmByName} isFav={favorites.includes(openCoffee.id)} onToggleFav={toggleFav} seller={seller} reviews={reviews} orders={orders} customer={customer} onAddReview={addReview}/>}
        {openFarm && <FarmProfile finca={openFarm} onBack={() => setOpenFarm(null)} onAdd={addToCart} onOpenCoffee={(c) => setOpenCoffee(c)} favorites={favorites} onToggleFav={toggleFav}/>}
        {editingCoffee !== null && seller && <CoffeeForm seller={seller} initial={editingCoffee} onSave={saveCoffee} onClose={() => setEditingCoffee(null)}/>}
        {cartOpen && <CartView items={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onUpdateQty={updateQty} onCheckout={handleCheckout} onExplore={() => { setCartOpen(false); setActiveNav("shop"); }} savedCustomer={customer}/>}
        {filtersOpen && <FiltersPanel initial={filters} onApply={(f) => { setFilters(f); setFiltersOpen(false); }} onClose={() => setFiltersOpen(false)} onClear={() => { setFilters(DEFAULT_FILTERS); }}/>}
        {subscribeOpen && <SubscriptionPanel onSubscribe={subscribeTo} onClose={() => setSubscribeOpen(false)}/>}
        {menuOpen && <SideMenu onClose={() => setMenuOpen(false)} cartCount={cartCount} seller={seller} hasSubscription={!!subscription} customer={customer} onGo={(id) => {
          setMenuOpen(false);
          if (id === "cart") setCartOpen(true);
          else if (id === "subscription") setSubscribeOpen(true);
          else setActiveNav(id);
        }}/>}
        <Toast toast={toast} onDone={() => setToast(null)}/>
      </div>

      <div className="hidden sm:block mt-3 text-[#555] font-sans text-[11px] tracking-[0.1em]">
        PAQARINA COFFEE — Marketplace
      </div>
    </div>
  );
}

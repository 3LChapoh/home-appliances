function slugify(s){return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-+|-+$)/g,"")||"product"}
// Online product photography (Unsplash) — two photo IDs per category, cycled across products so
// each boutique's fragrances get a bit of visual variety without needing local /img assets.
function uimg(id,w=800,h=1000){return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`}
const CAT_IMAGES={
 edp:[["3C5ZfCLSGC4","_ju6ZXbNKvY"],["JW0s7FI7ioI","n6LbQiWEcyo"]],
 oud:[["3PDQa7TLBaQ","T4-HnUU5Qmo"],["MyzZWb87HuM","zfvilY9-Wfk"]],
 gifts:[["gHnPWtW2NlE","L1aiboY6WnE"],["kE0DiffIUhA","s9AFqw6SJms"]],
 mists:[["zUMJAdePsBE","ZIihTgf5uGg"],["ZIihTgf5uGg","zUMJAdePsBE"]],
 home:[["mFTOFzUKdl0","2BxHT1koCpk"],["2BxHT1koCpk","mFTOFzUKdl0"]],
 niche:[["QkC2gICf0zc","MPs_GAPXU8E"],["Y8kwv9_Vay8","ZwnxpvwJO2U"]]
};
const DEFAULT_IMG=uimg("QkC2gICf0zc"),DEFAULT_ALT=uimg("_ju6ZXbNKvY");
function catImagePair(catKey,seq){const pool=CAT_IMAGES[catKey]||CAT_IMAGES.edp;const pair=pool[seq%pool.length];return{image:uimg(pair[0]),alt:uimg(pair[1],700,850)}}
const categories=[
 {id:"edp",name:"Eau de Parfum",color:"#4d91c9",desc:"Signature compositions"},
 {id:"oud",name:"Oud & Attars",color:"#d65f87",desc:"Deep, resinous trails"},
 {id:"gifts",name:"Gift Sets",color:"#4da873",desc:"Curated scent rituals"},
 {id:"mists",name:"Body Mists",color:"#9b72c7",desc:"Light everyday freshness"},
 {id:"home",name:"Home Fragrance",color:"#d29a39",desc:"Scent your surroundings"},
 {id:"niche",name:"Niche & Rare",color:"#c9574d",desc:"Limited discoveries"}
];
const catSeqCounter={};
const baseProducts=[
 ["Velvet Nairobi","edp","Maison Scents KE",6800,"A plush floral-amber with saffron, rose and warm woods."],
 ["Golden Hour","edp","Westlands Perfume House",8200,"Mandarin, jasmine and sandalwood made for late city evenings."],
 ["Santal After Rain","edp","Karen Fragrance Atelier",7400,"Creamy sandalwood, petrichor and a soft musk trail."],
 ["Rosewood No. 7","edp","Village Market Perfumery",5950,"Modern rose lifted by pink pepper and polished cedar."],
 ["Oud Nairobi","oud","The Attar Room Nairobi",11200,"Smoky Cambodian oud softened with amber and saffron."],
 ["Amber Majlis","oud","Maison Scents KE",9600,"Rich amber, cardamom, incense and a lingering oud heart."],
 ["Saffron Attar","oud","The Attar Room Nairobi",7200,"Concentrated saffron, leather and sweet resin in a travel vial."],
 ["Pearl Oud Reserve","oud","Karen Fragrance Atelier",14500,"A rare, polished oud interpretation with iris and vanilla."],
 ["Sunday Scent Set","gifts","Village Market Perfumery",9800,"Four discovery-sized scents presented in a keepsake box."],
 ["The Nairobi Duo","gifts","Westlands Perfume House",7600,"Day and evening fragrances paired for effortless rotation."],
 ["Rose & Fig Ritual","gifts","Karen Fragrance Atelier",6350,"A fragrant trio for hands, body and linens."],
 ["Citrus Veil","mists","Maison Scents KE",1650,"Bergamot, neroli and clean musk for warm Nairobi days."],
 ["Coral Bloom Mist","mists","Westlands Perfume House",1850,"Peony, lychee and sheer woods in a refreshing mist."],
 ["Green Tea Garden","mists","Village Market Perfumery",1750,"Green tea, mint leaf and soft white musk."],
 ["Cedar Room","home","Karen Fragrance Atelier",3900,"Dry cedar, amber and vetiver for a quietly luxurious room."],
 ["Nairobi Rain Candle","home","Maison Scents KE",4600,"Wet earth, eucalyptus and cedarwood in a hand-poured candle."],
 ["Velvet Incense","home","The Attar Room Nairobi",5200,"Resinous incense with sandalwood and a subtle rose note."],
 ["Black Orchid Extrait","niche","Westlands Perfume House",22000,"A limited extrait with dark orchid, plum, leather and oud."],
 ["Kilimani Nocturne","niche","Karen Fragrance Atelier",18900,"Plum, black tea, suede and incense with an elegant drydown."],
 ["Gold Label 01","niche","Village Market Perfumery",20500,"A rare amber extrait built around vanilla, tobacco and myrrh."]
].map((p,i)=>{
 const slug=slugify(p[0]),catKey=p[1];
 const seq=(catSeqCounter[catKey]=(catSeqCounter[catKey]||0));
 catSeqCounter[catKey]++;
 const pics=catImagePair(catKey,seq);
 return{id:"p"+i,name:p[0],cat:catKey,vendor:p[2],price:p[3],desc:p[4],image:pics.image,alt:pics.alt,imgSlug:slug,qty:i%7===0?3:24};
});
function stockLabel(p){if(p.qty<=0)return"Out of stock";if(p.qty<=4)return"Low stock";return"In stock"}

const heroSeeds=["3PDQa7TLBaQ","QkC2gICf0zc","gHnPWtW2NlE","_ju6ZXbNKvY","MyzZWb87HuM"];
const state=JSON.parse(localStorage.getItem("rubyChoiceState")||"null")||{cart:[],orders:[],applications:[],products:null,favourites:[],theme:"dark",customer:{name:"",email:""},vendorSession:null,adminSession:false};
if(typeof state.adminSession!=="boolean")state.adminSession=false;
if(state.vendorSession===undefined)state.vendorSession=null;
if(!Array.isArray(state.favourites))state.favourites=[];
if(!Array.isArray(state.products)||!state.products.length)state.products=baseProducts;
const products=state.products;
let saveError=false;
function save(){
 try{localStorage.setItem("rubyChoiceState",JSON.stringify(state));saveError=false}
 catch(e){if(!saveError){saveError=true;toast("Storage is full — try a smaller photo or fewer items",true)}}
}
let __idSeq=0;
function newProductId(){return "p"+Date.now()+"-"+(__idSeq++)}
function seedVendorApplications(){
 if(!Array.isArray(state.applications))state.applications=[];
 const names=[...new Set(baseProducts.map(p=>p.vendor))];
 let changed=false;
 names.forEach((name,i)=>{
  if(!state.applications.some(a=>a.boutique===name)){
   state.applications.push({id:"APP-seed-"+i,boutique:name,owner:name,email:"",phone:"",speciality:"",status:"Approved",pin:String(100000+i*137)});
   changed=true;
  }
 });
 if(changed)save();
}
seedVendorApplications();
function allVendorNames(){
 const fromProducts=products.map(p=>p.vendor);
 const fromApproved=state.applications.filter(a=>a.status==="Approved").map(a=>a.boutique);
 return [...new Set([...fromProducts,...fromApproved])];
}
const $=s=>document.querySelector(s);
function money(n){return "KES "+n.toLocaleString()}
function toast(t,isError){const el=$("#toast");el.textContent=t;el.classList.toggle("error",!!isError);el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
function debounce(fn,ms=250){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}
const isValidEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidKenyanPhone=v=>/^(?:\+?254|0)7\d{8}$|^(?:\+?254|0)1\d{8}$/.test(v.trim().replace(/\s+/g,""));
function markFieldError(input,msg){
 input.classList.add("invalid");
 let next=input.parentElement.querySelector(".field-error");
 if(!next){next=document.createElement("div");next.className="field-error";input.insertAdjacentElement("afterend",next)}
 next.textContent=msg;
}
function clearFieldError(input){input.classList.remove("invalid");input.parentElement.querySelector(".field-error")?.remove()}
function escapeHtml(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function pwdFieldHTML(id,opts={}){
 const {value="",placeholder="",required=true,inputmode=""}=opts;
 return `<div class="pwd-wrap"><input class="field" id="${id}" type="password" ${inputmode?`inputmode="${inputmode}"`:""} value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" autocomplete="off" ${required?"required":""}><button type="button" class="pwd-toggle" data-pwd-toggle="${id}" aria-label="Show password" aria-pressed="false"><svg class="eye-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg><svg class="eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.3 21.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a21.4 21.4 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></svg></button></div>`;
}
function wirePasswordToggles(root){
 (root||document).querySelectorAll("[data-pwd-toggle]").forEach(btn=>{
  btn.onclick=()=>{
   const input=$("#"+btn.dataset.pwdToggle);
   if(!input)return;
   const showing=input.type==="text";
   input.type=showing?"password":"text";
   btn.classList.toggle("revealed",!showing);
   btn.setAttribute("aria-pressed",String(!showing));
   btn.setAttribute("aria-label",showing?"Show password":"Hide password");
   input.focus({preventScroll:true});
   const len=input.value.length;
   try{input.setSelectionRange(len,len)}catch(e){}
  };
 });
}
function cat(id){return categories.find(c=>c.id===id)}
function renderCats(){let h="";categories.forEach((c,i)=>h+=`<button class="cat" style="--accent:${c.color}" data-cat="${c.id}"><span class="num">0${i+1}</span><b>${c.name}</b><small>${c.desc}</small></button>`);$("#catTrack").innerHTML=h;$("#catTrack").querySelectorAll(".cat").forEach(b=>b.onclick=()=>{$("#categoryFilter").value=b.dataset.cat;renderProducts();$("#collection").scrollIntoView({behavior:"smooth"})});$("#categoryFilter").innerHTML='<option value="">All categories</option>'+categories.map(c=>`<option value="${c.id}">${c.name}</option>`).join("");
$("#allCategoryFilter").innerHTML='<option value="">All categories</option>'+categories.map(c=>`<option value="${c.id}">${c.name}</option>`).join("");
populateVendorFilters()}
function populateVendorFilters(){
 const vendors=[...new Set(products.map(p=>p.vendor))].sort((a,b)=>a.localeCompare(b));
 ["vendorFilter","allVendorFilter"].forEach(id=>{
  const el=$("#"+id);if(!el)return;
  const cur=el.value;
  el.innerHTML='<option value="">All boutiques</option>'+vendors.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
  if(vendors.includes(cur))el.value=cur;
 });
}
function isFavourite(id){return state.favourites.includes(id)}
function productCard(p){
 let C=cat(p.cat),out=p.qty<=0,name=escapeHtml(p.name),vendor=escapeHtml(p.vendor),desc=escapeHtml(p.desc),fav=isFavourite(p.id);
 let mainAttrs=`onerror="this.closest('.p-img').classList.add('img-fallback')"`;
 let altAttrs=`onerror="this.style.display='none'"`;
 return `<article class="product" style="--accent:${C.color}"><div class="p-img"><img src="${p.image}" alt="${name}" loading="lazy" ${mainAttrs}><img class="alt" src="${p.alt}" alt="" aria-hidden="true" loading="lazy" ${altAttrs}><span class="badge">${C.name}</span><span class="stock">${stockLabel(p)}</span><button class="fav-btn${fav?" active":""}" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav?`Remove ${name} from favourites`:`Add ${name} to favourites`}">${fav?"♥":"♡"}</button></div><div class="p-body"><span class="vendor">${vendor}</span><h3>${name}</h3><p>${desc}</p><div class="price">${money(p.price)}</div><button class="add" data-add="${p.id}" ${out?"disabled":""} aria-label="${out?`${name} is out of stock`:`Add ${name} to bag`}">${out?"Out of stock":"Add to bag"}</button></div></article>`;
}
function filteredProducts(q="",c="",s="featured",v=""){
 q=q.toLowerCase();
 let list=products.filter(p=>(!q||`${p.name} ${p.vendor} ${p.desc}`.toLowerCase().includes(q))&&(!c||p.cat===c)&&(!v||p.vendor===v));
 if(s==="low")list.sort((a,b)=>a.price-b.price);
 if(s==="high")list.sort((a,b)=>b.price-a.price);
 if(s==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
 return list;
}
function wireAddButtons(root){
 root.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addCart(b.dataset.add));
 wireFavButtons(root);
}
function wireFavButtons(root){
 root.querySelectorAll("[data-fav]").forEach(b=>b.onclick=()=>toggleFav(b.dataset.fav));
}
function toggleFav(id){
 let i=state.favourites.indexOf(id);
 if(i>-1){state.favourites.splice(i,1);toast("Removed from favourites")}
 else{state.favourites.push(id);toast("Added to favourites")}
 save();renderFavCount();renderProducts();
 if($("#drawer").dataset.view==="favs")favouritesView();
}
function renderFavCount(){$("#favCountBottom").textContent=state.favourites.length}
function renderLandingProducts(){
 let list=filteredProducts($("#search").value,$("#categoryFilter").value,$("#sort").value,$("#vendorFilter").value);
 $("#resultCount").textContent=list.length+" fragrances";
 let visible=list.slice(0,8);
 $("#products").innerHTML=visible.map(productCard).join("")||`<div class="notice" style="grid-column:1/-1">No fragrance matched your search. Try another note, category or boutique.</div>`;
 wireAddButtons($("#products"));
 $("#landingMore").style.display=list.length>8?"block":"none";
}
const allCatalog={page:1,size:8};
function renderAllProducts(){
 let list=filteredProducts($("#allSearch").value,$("#allCategoryFilter").value,$("#allSort").value,$("#allVendorFilter").value);
 let totalPages=Math.max(1,Math.ceil(list.length/allCatalog.size));
 if(allCatalog.page>totalPages)allCatalog.page=totalPages;
 let start=(allCatalog.page-1)*allCatalog.size;
 let visible=list.slice(start,start+allCatalog.size);
 $("#allResultCount").textContent=list.length+" fragrances";
 $("#allProducts").innerHTML=visible.map(productCard).join("")||`<div class="notice" style="grid-column:1/-1">No fragrance matched your search.</div>`;
 wireAddButtons($("#allProducts"));
 $("#pageSizes").querySelectorAll(".page-size").forEach(b=>b.classList.toggle("active",+b.dataset.size===allCatalog.size));
 let pg=$("#pagination");
 pg.innerHTML="";
 let prev=document.createElement("button");prev.textContent="‹";prev.disabled=allCatalog.page===1;prev.onclick=()=>{allCatalog.page--;renderAllProducts();scrollAllTop()};pg.appendChild(prev);
 for(let i=1;i<=totalPages;i++){
   let b=document.createElement("button");b.textContent=i;b.className=i===allCatalog.page?"active":"";
   b.onclick=()=>{allCatalog.page=i;renderAllProducts();scrollAllTop()};pg.appendChild(b);
 }
 let info=document.createElement("span");info.className="page-info";info.textContent=`Page ${allCatalog.page} of ${totalPages}`;pg.appendChild(info);
 let next=document.createElement("button");next.textContent="›";next.disabled=allCatalog.page===totalPages;next.onclick=()=>{allCatalog.page++;renderAllProducts();scrollAllTop()};pg.appendChild(next);
}
function scrollAllTop(){window.scrollTo({top:0,behavior:"smooth"})}
function syncNavForView(){
 const onProducts=$("#productsView").style.display!=="none";
 $("#topHomeBtn").style.display=onProducts?"":"none";
 const shopBtn=$("#bnShop");
 shopBtn.textContent=onProducts?"⌂":"⊞";
 shopBtn.setAttribute("aria-label",onProducts?"Back to home":"Shop all products");
}
function safePushState(state,hash){
 try{history.pushState(state,"",hash)}
 catch(e){try{location.hash=hash.replace(/^#?/,"")}catch(e2){}}
}
function showProductsPage(){
 $("#landingView").style.display="none";
 $("#productsView").style.display="block";
 window.scrollTo(0,0);
 safePushState({view:"products"},"#/products");
 renderAllProducts();
 syncNavForView();
}
function showLandingPage(targetHash){
 $("#productsView").style.display="none";
 $("#landingView").style.display="block";
 safePushState({view:"landing"},"#"+(targetHash||""));
 if(targetHash){requestAnimationFrame(()=>document.querySelector(targetHash)?.scrollIntoView({behavior:"smooth"}))}
 else window.scrollTo(0,0);
 syncNavForView();
}
function routeFromHash(){
 if(location.hash==="#/products"){$("#landingView").style.display="none";$("#productsView").style.display="block";renderAllProducts()}
 else{$("#productsView").style.display="none";$("#landingView").style.display="block"}
 syncNavForView();
}
function renderProducts(){populateVendorFilters();renderLandingProducts();renderAllProducts()}
function addCart(id){
 let p=products.find(x=>x.id===id);if(!p||p.qty<=0)return toast("Sorry, that item is out of stock",true);
 let x=state.cart.find(i=>i.id===id);
 if(x&&x.qty>=p.qty)return toast(`Only ${p.qty} left in stock`,true);
 x?x.qty++:state.cart.push({id,qty:1});save();renderCartCount();toast("Added to your bag");
}
function renderCartCount(){let n=state.cart.reduce((n,i)=>n+i.qty,0);$("#cartCount").textContent=n;$("#cartCountBottom").textContent=n}
let lastFocused=null;
let pendingProductImage=null;
function wireProductImageInput(){
 pendingProductImage=null;
 $("#pfImage").onchange=e=>{
  const file=e.target.files[0];
  if(!file)return;
  if(!file.type.startsWith("image/")){toast("Please choose an image file",true);return}
  if(file.size>15*1024*1024){toast("That image is too large (max 15MB)",true);return}
  const reader=new FileReader();
  reader.onload=()=>{
   const img=new Image();
   img.onload=()=>{
    const MAX=900;
    let w=img.width,h=img.height;
    if(w>MAX||h>MAX){
     if(w>=h){h=Math.round(h*MAX/w);w=MAX}
     else{w=Math.round(w*MAX/h);h=MAX}
    }
    const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
    canvas.getContext("2d").drawImage(img,0,0,w,h);
    let compressed;
    try{compressed=canvas.toDataURL("image/jpeg",0.8)}catch(err){compressed=reader.result}
    pendingProductImage=compressed;
    const pv=$("#pfPreview");pv.src=compressed;pv.style.display="block";
   };
   img.onerror=()=>toast("Could not read that image",true);
   img.src=reader.result;
  };
  reader.onerror=()=>toast("Could not read that image",true);
  reader.readAsDataURL(file);
 };
}
function openDrawer(content){
 lastFocused=document.activeElement;
 $("#drawer").setAttribute("role","dialog");$("#drawer").setAttribute("aria-modal","true");
 delete $("#drawer").dataset.view;
 $("#drawer").innerHTML=content;$("#overlay").classList.add("open");
 $("#drawer").querySelectorAll("[data-close]").forEach(b=>b.onclick=closeDrawer);
 const focusable=$("#drawer").querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
 focusable[0]?.focus();
 $("#drawer").onkeydown=e=>{
  if(e.key==="Escape"){closeDrawer();return}
  if(e.key!=="Tab")return;
  const f=[...$("#drawer").querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled);
  if(!f.length)return;
  const first=f[0],last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 };
}
function closeDrawer(){$("#overlay").classList.remove("open");lastFocused?.focus()}
$("#overlay").onclick=e=>{if(e.target===$("#overlay"))closeDrawer()}
addEventListener("keydown",e=>{if(e.key==="Escape"&&$("#overlay").classList.contains("open"))closeDrawer()})
function cartView(){
 let before=state.cart.length;
 state.cart=state.cart.filter(i=>products.some(p=>p.id===i.id));
 if(state.cart.length!==before){save();renderCartCount()}
 let rows=state.cart.map(i=>{let p=products.find(x=>x.id===i.id);return `<div class="cart-row"><img src="${p.image}"><div><b class="serif">${escapeHtml(p.name)}</b><div class="muted" style="font-size:10px">${escapeHtml(p.vendor)}</div><div class="qty"><button data-q="${p.id}" data-d="-1">−</button><span>${i.qty}</span><button data-q="${p.id}" data-d="1">+</button></div></div><b class="mono" style="font-size:11px">${money(p.price*i.qty)}</b></div>`}).join("");
 let total=state.cart.reduce((n,i)=>n+(products.find(p=>p.id===i.id).price*i.qty),0);
 openDrawer(`<div class="drawer-head"><h2>Your bag</h2><button class="close" data-close>×</button></div>${rows||'<div class="notice">Your bag is waiting for something beautiful.</div>'}${rows?`<div class="total"><span>Total</span><span>${money(total)}</span></div><button class="goldbtn" id="checkoutBtn" style="width:100%">Proceed to checkout</button>`:""}`);
 $("#drawer").querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{
  let x=state.cart.find(i=>i.id===b.dataset.q),p=products.find(pr=>pr.id===b.dataset.q),d=+b.dataset.d;
  if(d>0&&p&&x.qty>=p.qty)return toast(`Only ${p.qty} left in stock`,true);
  x.qty+=d;if(x.qty<=0)state.cart=state.cart.filter(i=>i!==x);save();renderCartCount();cartView();
 });
 $("#checkoutBtn")?.addEventListener("click",checkoutView);
}
function favouritesView(){
 let before=state.favourites.length;
 state.favourites=state.favourites.filter(id=>products.some(p=>p.id===id));
 if(state.favourites.length!==before){save();renderFavCount()}
 let favProducts=state.favourites.map(id=>products.find(p=>p.id===id)).filter(Boolean);
 let rows=favProducts.map(p=>{
  let out=p.qty<=0;
  return `<div class="fav-row"><img src="${p.image}"><div><b class="serif">${escapeHtml(p.name)}</b><div class="muted" style="font-size:10px">${escapeHtml(p.vendor)}</div><b class="mono" style="font-size:11px">${money(p.price)}</b></div><div class="fav-actions"><button class="tiny${out?"":" ok"}" data-favadd="${p.id}" ${out?"disabled":""}>${out?"Out of stock":"Add to bag"}</button><button class="tiny danger" data-favremove="${p.id}">Remove</button></div></div>`;
 }).join("");
 openDrawer(`<div class="drawer-head"><h2>Your favourites</h2><button class="close" data-close>×</button></div>${rows||'<div class="notice">Tap the heart on any fragrance to save it here.</div>'}`);
 $("#drawer").dataset.view="favs";
 $("#drawer").querySelectorAll("[data-favadd]").forEach(b=>b.onclick=()=>addCart(b.dataset.favadd));
 $("#drawer").querySelectorAll("[data-favremove]").forEach(b=>b.onclick=()=>toggleFav(b.dataset.favremove));
}
function checkoutView(){
 let before=state.cart.length;
 state.cart=state.cart.filter(i=>products.some(p=>p.id===i.id));
 if(state.cart.length!==before){save();renderCartCount()}
 if(!state.cart.length){toast("Your bag is empty",true);return cartView()}
 let total=state.cart.reduce((n,i)=>n+products.find(p=>p.id===i.id).price*i.qty,0);
 openDrawer(`<div class="drawer-head"><h2>Checkout</h2><button class="close" data-close>×</button></div><div class="notice">Demo checkout — no real payment is processed.</div><form class="form" id="checkoutForm" novalidate><label>Name<input required class="field" id="coName" value="${escapeHtml(state.customer.name)}" placeholder="Your name"></label><label>Email<input required type="email" class="field" id="coEmail" value="${escapeHtml(state.customer.email)}" placeholder="you@example.com"></label><label>Phone<input required class="field" id="coPhone" value="${escapeHtml(state.customer.phone||"")}" placeholder="07XX XXX XXX"></label><label>Delivery location<input required class="field" id="coLoc" placeholder="Westlands, Nairobi"></label><label>Payment method<select class="field" id="coPayment"><option>M-Pesa</option><option>Card</option><option>Cash on delivery</option></select></label><div class="total"><span>Total</span><span>${money(total)}</span></div><button class="goldbtn">Place order</button></form>`);
 $("#checkoutForm").onsubmit=e=>{
  e.preventDefault();
  let ok=true;
  [$("#coName"),$("#coEmail"),$("#coPhone"),$("#coLoc")].forEach(clearFieldError);
  if(!$("#coName").value.trim()){markFieldError($("#coName"),"Enter your name");ok=false}
  if(!isValidEmail($("#coEmail").value)){markFieldError($("#coEmail"),"Enter a valid email address");ok=false}
  if(!isValidKenyanPhone($("#coPhone").value)){markFieldError($("#coPhone"),"Enter a valid Kenyan phone number (e.g. 07XXXXXXXX)");ok=false}
  if(!$("#coLoc").value.trim()){markFieldError($("#coLoc"),"Enter a delivery location");ok=false}
  if(!ok)return;
  let stockChanged=false;
  state.cart.forEach(i=>{
   const p=products.find(x=>x.id===i.id);
   if(!p||p.qty<=0){stockChanged=true;return}
   if(i.qty>p.qty){i.qty=p.qty;stockChanged=true}
  });
  state.cart=state.cart.filter(i=>{const p=products.find(x=>x.id===i.id);return p&&p.qty>0&&i.qty>0});
  if(stockChanged){
   save();renderCartCount();renderProducts();
   toast("Stock changed on one or more items — please review your bag",true);
   return state.cart.length?cartView():checkoutView();
  }
  const liveTotal=state.cart.reduce((n,i)=>n+products.find(p=>p.id===i.id).price*i.qty,0);
  if(!confirm(`Place this order for ${money(liveTotal)}?`))return;
  state.customer.name=$("#coName").value;state.customer.email=$("#coEmail").value;state.customer.phone=$("#coPhone").value;
  state.cart.forEach(i=>{let p=products.find(x=>x.id===i.id);if(p&&typeof p.qty==="number")p.qty=Math.max(0,p.qty-i.qty)});
  state.orders.unshift({id:"RC-"+Date.now().toString().slice(-7),date:new Date().toLocaleDateString(),items:state.cart,total:liveTotal,status:"Pending",location:$("#coLoc").value,payment:$("#coPayment").value,customerName:state.customer.name,customerEmail:state.customer.email.trim().toLowerCase(),vendor:[...new Set(state.cart.map(i=>products.find(p=>p.id===i.id)?.vendor))]});
  state.cart=[];save();renderCartCount();renderProducts();closeDrawer();renderOrders();toast("Order placed — thank you")
 };
}
function myOrdersForCustomer(){
 const email=(state.customer.email||"").trim().toLowerCase();
 return email?state.orders.filter(o=>o.customerEmail===email):[];
}
function orderCardsHTML(list){
 return list.map(o=>`<div class="mini"><strong>${o.id}</strong><span class="muted">${o.date} · ${o.status}</span><br><b class="mono">${money(o.total)}</b><br><small>${escapeHtml(o.location)}${o.payment?` · ${escapeHtml(o.payment)}`:""}</small>${o.status==="Pending"?`<div class="actions" style="margin-top:6px"><button class="tiny danger" data-cancel-order="${o.id}">Cancel order</button></div>`:""}</div>`).join("");
}
function wireOrderCancelButtons(container,onDone){
 container.querySelectorAll("[data-cancel-order]").forEach(b=>b.onclick=()=>{
  const o=state.orders.find(x=>x.id===b.dataset.cancelOrder);
  if(!o||o.status!=="Pending")return;
  if(!confirm(`Cancel order ${o.id}? Stock will be restored.`))return;
  setOrderStatus(o,"Cancelled");
  save();renderProducts();renderOrders();
  toast(`${o.id} cancelled`);
  if(onDone)onDone();
 });
}
function renderOrders(){
 let el=$("#orderSummary");
 const email=(state.customer.email||"").trim().toLowerCase();
 if(!email){el.className="";el.textContent="Save your name and email in Account → Customer (or place an order) to see your orders here.";return}
 const mine=myOrdersForCustomer();
 if(!mine.length){el.className="";el.textContent=`No orders yet for ${state.customer.email}. Your completed purchases will appear here.`;return}
 el.className="mini-grid";
 el.innerHTML=orderCardsHTML(mine);
 wireOrderCancelButtons(el);
}
function loginView(){
 openDrawer(`<div class="drawer-head"><h2>Account</h2><button class="close" data-close>×</button></div><div class="tabs"><button class="tab active" data-role="customer">Customer</button><button class="tab" data-role="vendor">Vendor</button><button class="tab" data-role="admin">Admin</button></div><div id="loginBody"></div>`);
 const body=$("#loginBody");
 function customer(){body.innerHTML=`<form class="form" id="customerForm" novalidate><label>Name<input class="field" id="cuName" value="${escapeHtml(state.customer.name)}" required></label><label>Email<input class="field" id="cuEmail" value="${escapeHtml(state.customer.email)}" type="email" required></label><button class="goldbtn">Save customer profile</button></form>`;$("#customerForm").onsubmit=e=>{e.preventDefault();clearFieldError($("#cuName"));clearFieldError($("#cuEmail"));let ok=true;if(!$("#cuName").value.trim()){markFieldError($("#cuName"),"Enter your name");ok=false}if(!isValidEmail($("#cuEmail").value)){markFieldError($("#cuEmail"),"Enter a valid email address");ok=false}if(!ok)return;state.customer={...state.customer,name:$("#cuName").value,email:$("#cuEmail").value};save();renderOrders();toast("Profile saved");closeDrawer()}}
 function vendor(){
  const approved=state.applications.filter(a=>a.status==="Approved");
  body.innerHTML=`<div class="notice">Sign in with your boutique name and the activation PIN issued by Ruby's Choice admin after approval.</div><form class="form" id="vendorLogin"><label>Boutique<select class="field" id="vBoutique">${approved.length?approved.map(a=>`<option value="${escapeHtml(a.boutique)}" ${a.boutique===state.vendorSession?"selected":""}>${escapeHtml(a.boutique)}</option>`).join(""):`<option disabled>No approved boutiques yet</option>`}</select></label><label>Activation PIN${pwdFieldHTML("vPin",{placeholder:"6-digit PIN",inputmode:"numeric"})}</label><button class="goldbtn" ${approved.length?"":"disabled"}>Open vendor dashboard</button></form><p class="muted" style="font-size:11px;margin-top:10px">Don't have a PIN yet? <a href="#partner" id="vendorApplyLink" style="color:var(--gold2)">Apply as a boutique partner</a> — the admin issues your PIN once approved.</p>`;
  wirePasswordToggles(body);
  $("#vendorApplyLink").onclick=e=>{e.preventDefault();applyView()};
  $("#vendorLogin").onsubmit=e=>{
   e.preventDefault();
   const boutique=$("#vBoutique").value,pin=$("#vPin").value.trim();
   const app=state.applications.find(a=>a.boutique===boutique&&a.status==="Approved");
   if(!app)return toast("Select an approved boutique",true);
   if(!app.pin)return toast("No PIN issued yet — ask the admin to issue one",true);
   if(pin!==app.pin)return toast("Incorrect PIN",true);
   state.vendorSession=boutique;save();vendorDash();
  };
 }
 function admin(){body.innerHTML=`<div class="notice">Demo super-admin: <b>admin@rubyschoice.demo</b> / <b>admin123</b></div><form class="form" id="adminLogin"><label>Email<input class="field" id="ae" value="admin@rubyschoice.demo" required></label><label>Password${pwdFieldHTML("ap",{value:"admin123",placeholder:"Password"})}</label><button class="goldbtn">Open admin dashboard</button></form>`;wirePasswordToggles(body);$("#adminLogin").onsubmit=e=>{e.preventDefault();if($("#ae").value==="admin@rubyschoice.demo"&&$("#ap").value==="admin123"){state.adminSession=true;save();adminDash()}else toast("Demo credentials do not match",true)}}
 customer();$("#drawer").querySelectorAll("[data-role]").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");({customer,vendor,admin}[b.dataset.role])()})
}
function applyView(){
 openDrawer(`<div class="drawer-head"><h2>Partner application</h2><button class="close" data-close>×</button></div><p class="muted" style="font-size:12px">Tell us about your Nairobi boutique. Applications are reviewed by the Ruby's Choice team.</p><form class="form" id="applyForm"><label>Boutique name<input required class="field" id="an"></label><label>Owner name<input required class="field" id="ao"></label><label>Email<input required type="email" class="field" id="am"></label><label>Phone<input required class="field" id="apn"></label><label>Speciality<textarea required class="field" id="as" placeholder="Oud, niche perfume, gift sets…"></textarea></label><button class="goldbtn">Submit application</button></form>`);
 $("#applyForm").onsubmit=e=>{
  e.preventDefault();
  let ok=true;
  clearFieldError($("#am"));clearFieldError($("#apn"));clearFieldError($("#an"));
  if(!isValidEmail($("#am").value)){markFieldError($("#am"),"Enter a valid email address");ok=false}
  if(!isValidKenyanPhone($("#apn").value)){markFieldError($("#apn"),"Enter a valid Kenyan phone number");ok=false}
  if(!ok)return;
  const boutiqueName=$("#an").value.trim();
  if(!boutiqueName){markFieldError($("#an"),"Enter your boutique name");return}
  const taken=state.applications.some(a=>a.boutique.trim().toLowerCase()===boutiqueName.toLowerCase()&&a.status!=="Rejected");
  if(taken){markFieldError($("#an"),"That boutique name is already registered");return}
  state.applications.push({id:"APP-"+Date.now().toString().slice(-6),boutique:boutiqueName,owner:$("#ao").value,email:$("#am").value,phone:$("#apn").value,speciality:$("#as").value,status:"Pending"});save();closeDrawer();toast("Application submitted");
 };
}
function setOrderStatus(o,newStatus){
 if(!o||o.status===newStatus)return false;
 if(newStatus==="Cancelled"&&o.status!=="Cancelled"){
  o.items.forEach(i=>{const p=products.find(x=>x.id===i.id);if(p)p.qty+=i.qty});
 }else if(o.status==="Cancelled"&&newStatus!=="Cancelled"){
  o.items.forEach(i=>{const p=products.find(x=>x.id===i.id);if(p)p.qty=Math.max(0,p.qty-i.qty)});
 }
 o.status=newStatus;
 return true;
}
function customerAccountView(){
 const email=(state.customer.email||"").trim().toLowerCase();
 if(!email)return loginView();
 const mine=myOrdersForCustomer();
 openDrawer(`<div class="drawer-head"><h2>My account</h2><div style="display:flex;gap:8px;align-items:center"><button class="tiny" id="customerSignOutBtn">Sign out</button><button class="close" data-close>×</button></div></div><div class="dash"><div class="notice">Signed in as <b>${escapeHtml(state.customer.name||state.customer.email)}</b></div><div class="stats"><div class="statcard"><strong>${mine.length}</strong><small>Orders</small></div><div class="statcard"><strong>${state.favourites.length}</strong><small>Favourites</small></div><div class="statcard"><strong>${state.cart.reduce((n,i)=>n+i.qty,0)}</strong><small>In bag</small></div><div class="statcard"><strong>${mine.filter(o=>o.status==="Delivered").length}</strong><small>Delivered</small></div></div><h3 class="serif">Profile</h3><form class="form" id="customerAccountForm" novalidate><label>Name<input class="field" id="caName" value="${escapeHtml(state.customer.name)}" required></label><label>Email<input class="field" id="caEmail" type="email" value="${escapeHtml(state.customer.email)}" required></label><label>Phone<input class="field" id="caPhone" value="${escapeHtml(state.customer.phone||"")}" placeholder="07XX XXX XXX"></label><button class="goldbtn">Save changes</button></form><h3 class="serif">Your orders</h3><div class="mini-grid" id="customerOrders">${orderCardsHTML(mine)||'<div class="notice">No orders yet. Your completed purchases will appear here.</div>'}</div><p class="muted" style="font-size:11px;margin-top:14px">Not you? <a href="#" id="switchAccountLink" style="color:var(--gold2)">Sign in as a different customer, vendor or admin</a></p></div>`);
 $("#customerSignOutBtn").onclick=()=>{state.customer={name:"",email:"",phone:""};save();renderOrders();toast("Signed out");loginView()};
 $("#switchAccountLink").onclick=e=>{e.preventDefault();loginView()};
 wireOrderCancelButtons($("#customerOrders"),customerAccountView);
 $("#customerAccountForm").onsubmit=e=>{
  e.preventDefault();
  clearFieldError($("#caName"));clearFieldError($("#caEmail"));
  let ok=true;
  if(!$("#caName").value.trim()){markFieldError($("#caName"),"Enter your name");ok=false}
  if(!isValidEmail($("#caEmail").value)){markFieldError($("#caEmail"),"Enter a valid email address");ok=false}
  if(!ok)return;
  state.customer={...state.customer,name:$("#caName").value,email:$("#caEmail").value,phone:$("#caPhone").value};
  save();renderOrders();toast("Profile saved");customerAccountView();
 };
}
function goToAccount(){
 if(state.adminSession)return adminDash();
 if(state.vendorSession)return vendorDash();
 if((state.customer.email||"").trim())return customerAccountView();
 return loginView();
}
function adminDash(){
 if(!state.adminSession)return loginView();
 let approved=state.applications.filter(a=>a.status==="Approved").length;
 openDrawer(`<div class="drawer-head"><h2>Admin</h2><div style="display:flex;gap:8px;align-items:center"><button class="tiny" id="adminSignOutBtn">Sign out</button><button class="close" data-close>×</button></div></div><div class="dash"><div class="stats"><div class="statcard"><strong>${products.length}</strong><small>Products</small></div><div class="statcard"><strong>${state.applications.length}</strong><small>Applications</small></div><div class="statcard"><strong>${state.orders.length}</strong><small>Orders</small></div><div class="statcard"><strong>${approved}</strong><small>Approved vendors</small></div></div><h3 class="serif">Vendor applications</h3><div class="mini-grid" id="apps"></div><h3 class="serif">Orders</h3><div class="mini-grid" id="adminOrders"></div><div class="drawer-head" style="margin:0"><h3 class="serif" style="margin:0">Product catalogue</h3><button class="tiny ok" id="addProductBtn">+ Add product</button></div><div class="mini-grid" id="adminProducts"></div></div>`);
 $("#addProductBtn").onclick=addProductView;
 $("#adminSignOutBtn").onclick=()=>{state.adminSession=false;save();toast("Signed out");loginView()};
 renderAdmin();
}
function renderAdmin(){
 let apps=$("#apps");if(!apps)return;
 apps.innerHTML=state.applications.length?state.applications.map(a=>`<div class="mini"><strong>${escapeHtml(a.boutique)}</strong><span>${escapeHtml(a.owner)} · ${escapeHtml(a.speciality)}</span><br><span class="muted">${a.status}</span><div class="actions">${a.status==="Pending"?`<button class="tiny ok" data-approve="${a.id}">Approve</button><button class="tiny danger" data-reject="${a.id}">Reject</button>`:""}<button class="tiny" data-pin="${a.id}">Issue PIN</button></div></div>`).join(""):'<div class="notice">No applications.</div>';
 const orderStatuses=["Pending","Processing","Shipped","Delivered","Cancelled"];
 $("#adminOrders").innerHTML=state.orders.length?state.orders.map(o=>`<div class="mini"><strong>${o.id}</strong><span>${o.date}${o.customerName?` · ${escapeHtml(o.customerName)}`:""}</span><br><b class="mono">${money(o.total)}</b><br><select class="field" style="margin-top:6px;padding:6px;font-size:10px" data-order-status="${o.id}">${orderStatuses.map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}</select></div>`).join(""):'<div class="notice">No orders.</div>';
 $("#adminProducts").innerHTML=products.map(p=>`<div class="mini"><strong>${escapeHtml(p.name)}</strong><span>${escapeHtml(p.vendor)}</span><br><b class="mono">${money(p.price)}</b><br><span class="muted">${stockLabel(p)} (${p.qty})</span><div class="actions"><button class="tiny" data-edit="${p.id}">Edit</button><button class="tiny danger" data-delete="${p.id}">Delete</button></div></div>`).join("");
 $("#adminOrders").querySelectorAll("[data-order-status]").forEach(sel=>sel.onchange=()=>{let o=state.orders.find(x=>x.id===sel.dataset.orderStatus);setOrderStatus(o,sel.value);save();renderOrders();renderProducts();renderAdmin();toast(`${o.id} marked ${o.status}`)});
 $("#apps").querySelectorAll("[data-approve]").forEach(b=>b.onclick=()=>{let a=state.applications.find(x=>x.id===b.dataset.approve);a.status="Approved";save();adminDash();toast("Vendor approved")});
 $("#apps").querySelectorAll("[data-reject]").forEach(b=>b.onclick=()=>{let a=state.applications.find(x=>x.id===b.dataset.reject);a.status="Rejected";save();adminDash();toast("Application rejected")});
 $("#apps").querySelectorAll("[data-pin]").forEach(b=>b.onclick=()=>{let a=state.applications.find(x=>x.id===b.dataset.pin);if(a.status!=="Approved")return toast("Approve vendor first");a.pin=a.pin||String(Math.floor(100000+Math.random()*900000));save();alert(`One-time activation PIN for ${a.boutique}: ${a.pin}`)});
 $("#adminProducts").querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>editProduct(b.dataset.edit));
 $("#adminProducts").querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>{let p=products.find(x=>x.id===b.dataset.delete);if(p&&confirm(`Delete ${p.name}?`)){products.splice(products.indexOf(p),1);state.cart=state.cart.filter(i=>i.id!==p.id);state.favourites=state.favourites.filter(id=>id!==p.id);save();renderProducts();renderCartCount();renderFavCount();adminDash();toast("Product deleted")}})
}
function addProductView(){
 const vendorNames=allVendorNames();
 openDrawer(`<div class="drawer-head"><h2>Add product</h2><button class="close" data-close>×</button></div><form class="form" id="addProductForm"><label>Product name<input class="field" id="pfName" required placeholder="e.g. Velvet Nairobi"></label><label>Boutique / vendor<input class="field" id="pfVendor" list="vendorOptions" required placeholder="Boutique name"></label><datalist id="vendorOptions">${vendorNames.map(v=>`<option value="${escapeHtml(v)}">`).join("")}</datalist><label>Category<select class="field" id="pfCategory">${categories.map(c=>`<option value="${c.id}">${c.name}</option>`).join("")}</select></label><label>Price (KES)<input class="field" id="pfPrice" type="number" min="0" required></label><label>Stock quantity<input class="field" id="pfQty" type="number" min="0" required></label><label>Description<textarea class="field" id="pfDesc" placeholder="Notes, top and base accords…"></textarea></label><label>Product photo<input class="field" id="pfImage" type="file" accept="image/*"></label><div><img id="pfPreview" style="width:90px;height:100px;object-fit:cover;border-radius:8px;border:1px solid var(--line);display:none"></div><button class="goldbtn">Add product</button></form>`);
 wireProductImageInput();
 $("#addProductForm").onsubmit=e=>{
  e.preventDefault();
  const name=$("#pfName").value.trim(),vendor=$("#pfVendor").value.trim();
  if(!name||!vendor){toast("Enter a product name and boutique",true);return}
  const slug=slugify(name),image=pendingProductImage||DEFAULT_IMG;
  products.push({id:newProductId(),name,cat:$("#pfCategory").value,vendor,price:Math.max(0,+$("#pfPrice").value||0),desc:$("#pfDesc").value.trim(),image,alt:pendingProductImage||DEFAULT_ALT,imgSlug:slug,qty:Math.max(0,+$("#pfQty").value||0)});
  save();renderProducts();adminDash();toast("Product added to the catalogue");
 };
}
function editProduct(id,opts={}){
 const onDone=opts.onDone||adminDash,lockVendor=!!opts.lockVendor;
 let p=products.find(x=>x.id===id);
 openDrawer(`<div class="drawer-head"><h2>Edit product</h2><button class="close" data-close>×</button></div><form class="form" id="editForm"><label>Name<input class="field" id="pn" value="${escapeHtml(p.name)}" required></label><label>Boutique / vendor<input class="field" id="pv" list="vendorOptions" value="${escapeHtml(p.vendor)}" ${lockVendor?"disabled":""} required></label><datalist id="vendorOptions">${allVendorNames().map(v=>`<option value="${escapeHtml(v)}">`).join("")}</datalist><label>Category<select class="field" id="pc">${categories.map(c=>`<option value="${c.id}" ${p.cat===c.id?"selected":""}>${c.name}</option>`).join("")}</select></label><label>Price<input class="field" id="pp" type="number" min="0" value="${p.price}" required></label><label>Stock quantity<input class="field" id="pq" type="number" min="0" value="${p.qty}" required></label><label>Description<textarea class="field" id="pd">${escapeHtml(p.desc)}</textarea></label><label>Product photo<input class="field" id="pfImage" type="file" accept="image/*"></label><div><img id="pfPreview" src="${p.image}" onerror="this.style.display='none'" style="width:90px;height:100px;object-fit:cover;border-radius:8px;border:1px solid var(--line)"></div><button class="goldbtn">Save changes</button></form>`);
 wireProductImageInput();
 $("#editForm").onsubmit=e=>{
  e.preventDefault();
  const name=$("#pn").value.trim(),vendor=lockVendor?p.vendor:$("#pv").value.trim();
  if(!name||!vendor){toast("Enter a product name and boutique",true);return}
  p.name=name;p.vendor=vendor;p.cat=$("#pc").value;p.price=Math.max(0,+$("#pp").value||0);p.qty=Math.max(0,+$("#pq").value||0);p.desc=$("#pd").value.trim();
  if(pendingProductImage){p.image=pendingProductImage;p.alt=pendingProductImage}
  save();renderProducts();onDone();toast("Product updated");
 };
}
function vendorDash(){
 if(!state.vendorSession)return loginView();
 const vendorName=state.vendorSession;
 const myProducts=products.filter(p=>p.vendor===vendorName);
 const myOrders=state.orders.filter(o=>(o.vendor||[]).includes(vendorName));
 const orderStatuses=["Pending","Processing","Shipped","Delivered","Cancelled"];
 const deliveredCount=myOrders.filter(o=>o.status==="Delivered").length;
 openDrawer(`<div class="drawer-head"><h2>Vendor studio</h2><div style="display:flex;gap:8px;align-items:center"><button class="tiny" id="vendorSignOutBtn">Sign out</button><button class="close" data-close>×</button></div></div><div class="dash"><div class="notice">Signed in as <b>${escapeHtml(vendorName)}</b></div><div class="stats"><div class="statcard"><strong>${escapeHtml(vendorName)}</strong><small>Boutique</small></div><div class="statcard"><strong>${myProducts.length}</strong><small>Live products</small></div><div class="statcard"><strong>${myOrders.length}</strong><small>Your orders</small></div><div class="statcard"><strong>${deliveredCount}</strong><small>Delivered</small></div></div><div class="drawer-head" style="margin:0"><h3 class="serif" style="margin:0">Manage your catalogue</h3><button class="tiny ok" id="vendorAddProductBtn">+ Add product</button></div><div class="mini-grid" id="vendorProducts">${myProducts.map(p=>`<div class="mini"><strong>${escapeHtml(p.name)}</strong><b class="mono">${money(p.price)}</b><br><span class="muted">${stockLabel(p)} (${p.qty})</span><div class="actions"><button class="tiny" data-vedit="${p.id}">Edit</button><button class="tiny danger" data-vdelete="${p.id}">Delete</button></div></div>`).join("")||'<div class="notice">No products yet for this boutique.</div>'}</div><h3 class="serif">Your orders</h3><div class="notice" style="font-size:11px">Orders may include items from other boutiques — updating status here applies to the whole order.</div><div class="mini-grid" id="vendorOrders">${myOrders.length?myOrders.map(o=>`<div class="mini"><strong>${o.id}</strong><span>${o.date}${o.customerName?` · ${escapeHtml(o.customerName)}`:""}</span><br><b>${money(o.total)}</b><br><select class="field" style="margin-top:6px;padding:6px;font-size:10px" data-vorder-status="${o.id}">${orderStatuses.map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}</select></div>`).join(""):'<div class="notice">No orders yet for this boutique.</div>'}</div></div>`);
 $("#vendorAddProductBtn").onclick=vendorAddProductView;
 $("#vendorSignOutBtn").onclick=()=>{state.vendorSession=null;save();toast("Signed out");loginView()};
 $("#vendorOrders").querySelectorAll("[data-vorder-status]").forEach(sel=>sel.onchange=()=>{
  const o=state.orders.find(x=>x.id===sel.dataset.vorderStatus);
  if(!o||!(o.vendor||[]).includes(vendorName))return;
  setOrderStatus(o,sel.value);
  save();renderOrders();renderProducts();vendorDash();toast(`${o.id} marked ${o.status}`);
 });
 $("#vendorProducts").querySelectorAll("[data-vedit]").forEach(b=>b.onclick=()=>{
  const p=products.find(x=>x.id===b.dataset.vedit);
  if(!p||p.vendor!==vendorName)return toast("You can only edit your own boutique's products",true);
  editProduct(p.id,{onDone:vendorDash,lockVendor:true});
 });
 $("#vendorProducts").querySelectorAll("[data-vdelete]").forEach(b=>b.onclick=()=>{
  const p=products.find(x=>x.id===b.dataset.vdelete);
  if(!p||p.vendor!==vendorName)return toast("You can only delete your own boutique's products",true);
  if(!confirm(`Delete ${p.name}?`))return;
  products.splice(products.indexOf(p),1);
  state.cart=state.cart.filter(i=>i.id!==p.id);
  state.favourites=state.favourites.filter(id=>id!==p.id);
  save();renderProducts();renderCartCount();renderFavCount();vendorDash();toast("Product deleted");
 });
}
function vendorAddProductView(){
 if(!state.vendorSession)return loginView();
 const vendorName=state.vendorSession;
 openDrawer(`<div class="drawer-head"><h2>Add product</h2><button class="close" data-close>×</button></div><form class="form" id="vendorAddForm"><div class="notice">Listing under <b>${escapeHtml(vendorName)}</b></div><label>Product name<input class="field" id="pfName" required placeholder="e.g. Velvet Nairobi"></label><label>Category<select class="field" id="pfCategory">${categories.map(c=>`<option value="${c.id}">${c.name}</option>`).join("")}</select></label><label>Price (KES)<input class="field" id="pfPrice" type="number" min="0" required></label><label>Stock quantity<input class="field" id="pfQty" type="number" min="0" required></label><label>Description<textarea class="field" id="pfDesc" placeholder="Notes, top and base accords…"></textarea></label><label>Product photo<input class="field" id="pfImage" type="file" accept="image/*"></label><div><img id="pfPreview" style="width:90px;height:100px;object-fit:cover;border-radius:8px;border:1px solid var(--line);display:none"></div><button class="goldbtn">Add product</button></form>`);
 wireProductImageInput();
 $("#vendorAddForm").onsubmit=e=>{
  e.preventDefault();
  const name=$("#pfName").value.trim();
  if(!name){toast("Enter a product name",true);return}
  const slug=slugify(name),image=pendingProductImage||DEFAULT_IMG;
  products.push({id:newProductId(),name,cat:$("#pfCategory").value,vendor:vendorName,price:Math.max(0,+$("#pfPrice").value||0),desc:$("#pfDesc").value.trim(),image,alt:pendingProductImage||DEFAULT_ALT,imgSlug:slug,qty:Math.max(0,+$("#pfQty").value||0)});
  save();renderProducts();vendorDash();toast("Product added to your boutique");
 };
}
function heroSetup(){
 const c=$("#collage");heroSeeds.forEach((s,i)=>{let slot=document.createElement("div");slot.className="hero-slot "+(["fx1","fx2","fx3"][i%3]);slot.style.animationDelay=(-i*3.4)+"s";slot.innerHTML=`<img src="${uimg(s,600,800)}" alt="Fine fragrance" loading="lazy" onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(160deg,var(--panel),var(--panel2))'">`;c.appendChild(slot)});
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches, slots=[...document.querySelectorAll(".hero-slot")], data=slots.map((_,i)=>({ax:3+Math.random()*5,ay:3+Math.random()*5,fx:.00045+Math.random()*.00055,fy:.0004+Math.random()*.0005,ph:Math.random()*Math.PI*2}));
 let px=-9999,py=-9999,last=0;
 c.addEventListener("pointermove",e=>{px=e.clientX;py=e.clientY});c.addEventListener("pointerleave",()=>{px=py=-9999});
 c.addEventListener("pointerdown",e=>{let slot=e.target.closest(".hero-slot");if(slot){slot.animate([{transform:"scale(1)"},{transform:"scale(1.07)"},{transform:"scale(1)"}],{duration:350});slot.style.boxShadow="0 0 0 3px #c9a24b88,0 25px 65px #000a";setTimeout(()=>slot.style.boxShadow="",450)}});
 function frame(t){if(!reduced){let dt=t-last;last=t;slots.forEach((slot,i)=>{let d=data[i],im=slot.querySelector("img"),x=Math.sin(t*d.fx+d.ph)*d.ax,y=Math.cos(t*d.fy+d.ph)*d.ay;if(px>-100){let r=slot.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=cx-px,dy=cy-py,dist=Math.hypot(dx,dy);if(dist<200){let f=(1-dist/200)*5;x+=dx/dist*f;y+=dy/dist*f}}im.style.transform=`translate3d(${x}px,${y}px,0) rotate(${Math.sin(t*d.fx+d.ph)*1.2}deg)`})}requestAnimationFrame(frame)}requestAnimationFrame(frame);
 let ly=0,target=0;addEventListener("scroll",()=>target=scrollY,{passive:true});function par(){ly+=(target-ly)*.08;$("#far").style.transform=`translate3d(0,${ly*.08}px,0)`;c.style.transform=`translate3d(0,${ly*.16}px,0)`;requestAnimationFrame(par)}par()
}
function init(){
 if(state.theme==="light")document.body.classList.add("light");
 $("#themeBtn").onclick=()=>{state.theme=document.body.classList.toggle("light")?"light":"dark";save()};
 $("#cartBtn").onclick=cartView;$("#accountBtn").onclick=goToAccount;$("#partnerBtn").onclick=applyView;$("#applyBtn").onclick=applyView;
 document.querySelectorAll("[data-open-apply]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();applyView()}));
 $("#topHomeBtn").onclick=()=>showLandingPage();
 $("#bnTheme").onclick=()=>$("#themeBtn").click();
 $("#bnCart").onclick=cartView;$("#bnAccount").onclick=goToAccount;$("#bnFav").onclick=favouritesView;
 $("#bnShop").onclick=()=>{$("#productsView").style.display!=="none"?showLandingPage():showProductsPage()};
 const backToTopEl=$("#backToTop"),bttProgress=$("#bttProgress"),CIRC=2*Math.PI*bttProgress.r.baseVal.value;
 bttProgress.style.strokeDasharray=CIRC;bttProgress.style.strokeDashoffset=CIRC;
 backToTopEl.onclick=()=>{
  window.scrollTo({top:0,behavior:"smooth"});
  backToTopEl.animate([{transform:"scale(1)"},{transform:"scale(.85) rotate(-14deg)"},{transform:"scale(1) rotate(0)"}],{duration:420,easing:"cubic-bezier(.34,1.56,.64,1)"});
 };
 const navEl=$(".nav"),bottomNavEl=$("#bottomNav");
 let scrollTicking=false;
 function onScroll(){
  const scrolled=window.scrollY>80;
  navEl.classList.toggle("scrolled",scrolled);
  bottomNavEl.classList.toggle("show",scrolled);
  backToTopEl.classList.toggle("show",scrolled);
  const max=document.documentElement.scrollHeight-innerHeight;
  const pct=max>0?Math.min(1,window.scrollY/max):0;
  bttProgress.style.strokeDashoffset=CIRC*(1-pct);
  scrollTicking=false;
 }
 addEventListener("scroll",()=>{if(!scrollTicking){requestAnimationFrame(onScroll);scrollTicking=true}},{passive:true});
 onScroll();
 $("#exploreBtn").onclick=()=>$("#collection").scrollIntoView({behavior:"smooth"});
 const debouncedLanding=debounce(renderLandingProducts,220);
 const debouncedAll=debounce(()=>{allCatalog.page=1;renderAllProducts()},220);
 ["search","categoryFilter","vendorFilter","sort"].forEach(id=>$("#"+id).addEventListener(id==="search"?"input":"change",id==="search"?debouncedLanding:renderLandingProducts));
["allSearch","allCategoryFilter","allVendorFilter","allSort"].forEach(id=>$("#"+id).addEventListener(id==="allSearch"?"input":"change",id==="allSearch"?debouncedAll:()=>{allCatalog.page=1;renderAllProducts()}));
$("#pageSizes").querySelectorAll(".page-size").forEach(b=>b.onclick=()=>{allCatalog.size=+b.dataset.size;allCatalog.page=1;renderAllProducts()});
$("#viewMoreBtn").onclick=showProductsPage;
$("#backToHomeBtn").onclick=()=>showLandingPage();
document.addEventListener("click",e=>{
 const a=e.target.closest("a[href^='#']");
 if(a&&!a.hasAttribute("data-open-apply")&&$("#productsView").style.display!=="none"){
   const hash=a.getAttribute("href");
   if(hash&&hash!=="#/products"){e.preventDefault();showLandingPage(hash)}
 }
});
addEventListener("popstate",routeFromHash);
 renderCats();renderProducts();renderCartCount();renderFavCount();renderOrders();heroSetup();
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(x=>io.observe(x));
 routeFromHash();
}
init();

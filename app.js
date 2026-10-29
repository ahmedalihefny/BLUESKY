(function(){
var C=window.CFG,P=window.PRODUCTS,$=function(s){return document.querySelector(s)};
var fmt=function(n){return Math.round(n).toLocaleString("en-US")+" ج.م"};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var cart=[];try{cart=JSON.parse(localStorage.getItem("bs_cart")||"[]")}catch(e){}
var pct=0,q="",cat="",sort="";
function save(){try{localStorage.setItem("bs_cart",JSON.stringify(cart))}catch(e){}}
function prod(id){return P.filter(function(p){return p.id===id})[0]}
cart=cart.filter(function(i){return prod(i.id)&&prod(i.id).prices[i.w]});
function opts(arr,sel){return arr.map(function(v){return'<option'+(v==sel?" selected":"")+'>'+v+'</option>'}).join("")}
$("#wa").href="https://wa.me/"+C.whatsapp+"?text="+encodeURIComponent("مرحباً بلو سكاي، أريد الاستفسار عن مرتبة");
var cats=P.map(function(p){return p.family}).filter(function(v,i,a){return a.indexOf(v)===i});
function chips(){$("#chips").innerHTML=["الكل"].concat(cats).map(function(c){var on=(c==="الكل"&&!cat)||c===cat;return'<button class="'+(on?"on":"")+'" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join("")}
function card(p){var ws=Object.keys(p.prices).map(Number);
 var img=p.image?'<img loading="lazy" src="'+esc(p.image)+'" alt="'+esc(p.name)+'">':'<img class="fb" src="assets/logo.png" alt="">';
 return'<article class="card" data-id="'+p.id+'"><div class="ph">'+img+'</div><h3>'+esc(p.name)+'</h3><div class="pr">'+fmt(p.prices[ws[0]])+'</div>'+
 '<div class="opts"><label>العرض<select class="w">'+opts(ws,ws[0])+'</select></label><label>الطول<select class="l">'+opts(C.lengths,C.defaultLength)+'</select></label>'+
 '<label>الكمية<select class="n">'+opts([1,2,3,4,5,6,7,8,9,10],1)+'</select></label></div><button class="add">أضف للسلة</button></article>'}
function render(){var l=P.filter(function(p){return(!cat||p.family===cat)&&p.name.indexOf(q.trim())>-1});
 var b=function(p){return p.prices[90]};
 if(sort==="asc")l.sort(function(x,y){return b(x)-b(y)});if(sort==="desc")l.sort(function(x,y){return b(y)-b(x)});
 $("#grid").innerHTML=l.map(card).join("")||'<p class="empty">لا توجد نتائج. جرّب كلمة أخرى أو اختر "الكل".</p>'}
$("#q").oninput=function(){q=this.value;render()};$("#sort").onchange=function(){sort=this.value;render()};
$("#chips").onclick=function(e){var c=e.target.getAttribute("data-c");if(!c)return;cat=c==="الكل"?"":c;chips();render()};
$("#grid").onchange=function(e){if(!e.target.classList.contains("w"))return;var c=e.target.closest(".card");c.querySelector(".pr").textContent=fmt(prod(+c.dataset.id).prices[e.target.value])};
$("#grid").onclick=function(e){if(!e.target.classList.contains("add"))return;var c=e.target.closest(".card"),id=+c.dataset.id,w=+c.querySelector(".w").value,l=+c.querySelector(".l").value,n=+c.querySelector(".n").value;
 var f=cart.filter(function(i){return i.id===id&&i.w===w&&i.l===l})[0];if(f)f.n=Math.min(f.n+n,50);else cart.push({id:id,w:w,l:l,n:n});
 save();count();e.target.textContent="✓ تمت الإضافة";setTimeout(function(){e.target.textContent="أضف للسلة"},1200)};
function count(){$("#badge").textContent=cart.reduce(function(s,i){return s+i.n},0)}
function sub(){return cart.reduce(function(s,i){return s+prod(i.id).prices[i.w]*i.n},0)}
function open(){$("#ov").hidden=false;$("#drawer").hidden=false;drawer()}
function close(){$("#ov").hidden=true;$("#drawer").hidden=true}
$("#cartBtn").onclick=open;$("#cx").onclick=close;$("#ov").onclick=close;
function drawer(msg){var b=$("#dbody");
 if(!cart.length){b.innerHTML='<p class="empty">السلة فارغة. اختر مرتبة وأضفها للسلة.</p>';return}
 var d=sub()*pct/100;
 b.innerHTML=cart.map(function(i,k){var p=prod(i.id);return'<div class="it"><div><b>'+esc(p.name)+'</b><small>العرض '+i.w+' × الطول '+i.l+' سم</small><div class="qty"><button data-m="'+k+'">−</button><span>'+i.n+'</span><button data-p="'+k+'">+</button></div></div><div><b>'+fmt(p.prices[i.w]*i.n)+'</b><br><button class="rm" data-r="'+k+'">حذف</button></div></div>'}).join("")+
 '<div class="cp"><input id="cin" placeholder="كود الخصم"><button class="btn" id="cap" type="button">تطبيق</button></div><div class="err" id="cerr"></div>'+
 '<div class="row"><span>المجموع</span><span>'+fmt(sub())+'</span></div>'+(pct?'<div class="row"><span>خصم '+pct+'%</span><span>− '+fmt(d)+'</span></div>':'')+
 '<div class="row tot"><span>الإجمالي</span><span>'+fmt(sub()-d)+'</span></div>'+
 '<form id="f" class="f" novalidate><label>الاسم الكامل</label><input id="fn" autocomplete="name" placeholder="اكتب اسمك بالكامل">'+
 '<label>رقم الهاتف</label><input id="fp" type="tel" inputmode="numeric" autocomplete="tel" placeholder="مثال: 01012345678">'+
 '<label>العنوان بالتفصيل</label><textarea id="fa" rows="3" placeholder="الشارع ورقم العمارة والدور والشقة والمركز أو المدينة والمحافظة وعلامة مميزة"></textarea>'+
 '<label>طريقة الدفع</label><label class="pay"><input type="radio" name="pm" value="الدفع عند الاستلام" checked>الدفع عند الاستلام</label>'+
 '<label class="pay"><input type="radio" name="pm" value="عربون InstaPay أو فودافون كاش والباقي عند الاستلام">عربون عبر InstaPay أو فودافون كاش والباقي عند الاستلام</label><small id="dn"></small>'+
 '<label>ملاحظات (اختياري)</label><textarea id="fo" rows="2" placeholder="موعد مناسب للتوصيل…"></textarea>'+
 '<div class="err" id="ferr"></div><button class="btn" style="width:100%" type="submit">تأكيد الطلب عبر واتساب</button></form>';
 if(msg)$("#cerr").textContent=msg}
$("#dbody").onclick=function(e){var t=e.target,m=t.dataset;
 if(m.m!==undefined){var i=cart[+m.m];i.n--;if(i.n<1)cart.splice(+m.m,1)}else if(m.p!==undefined){cart[+m.p].n=Math.min(cart[+m.p].n+1,50)}else if(m.r!==undefined){cart.splice(+m.r,1)}
 else if(t.id==="cap"){coupon();return}else return;save();count();drawer()};
function coupon(){var v=$("#cin").value.trim().toLowerCase(),k=C.coupon;
 if(!v)return;if(v!==k.code.toLowerCase()){pct=0;drawer("الكود غير صحيح. تأكد من كتابته كما وصلك.");return}
 if(k.expires&&new Date()>new Date(k.expires+"T23:59:59")){pct=0;drawer("انتهى هذا العرض.");return}
 pct=k.percent;drawer()}
$("#dbody").onchange=function(e){if(e.target.name==="pm")$("#dn").textContent=e.target.value.indexOf("عربون")===0?C.depositNote:""};
$("#dbody").onsubmit=function(e){e.preventDefault();
 var ar="٠١٢٣٤٥٦٧٨٩",ph=$("#fp").value.replace(/[٠-٩]/g,function(d){return ar.indexOf(d)}).replace(/\s|-/g,""),nm=$("#fn").value.trim(),ad=$("#fa").value.trim(),er=$("#ferr");
 if(nm.length<3){er.textContent="اكتب اسمك بالكامل.";return}
 if(!/^01[0125]\d{8}$/.test(ph)){er.textContent="اكتب رقم هاتف مصري صحيح من 11 رقماً.";return}
 if(ad.length<10){er.textContent="اكتب العنوان بالتفصيل: الشارع والمدينة والمحافظة.";return}
 var d=new Date(),z=function(n){return("0"+n).slice(-2)},no="BS-"+z(d.getMonth()+1)+z(d.getDate())+"-"+z(d.getHours())+z(d.getMinutes())+Math.floor(Math.random()*90+10),
 dis=sub()*pct/100,pm=document.querySelector("input[name=pm]:checked").value,
 t="طلب جديد "+no+"\n\n"+cart.map(function(i){var p=prod(i.id);return"• "+p.name+" – عرض "+i.w+" × طول "+i.l+" – عدد "+i.n+" – "+fmt(p.prices[i.w]*i.n)}).join("\n")+
 "\n\nالمجموع: "+fmt(sub())+(pct?"\nخصم "+pct+"% ("+C.coupon.code+"): − "+fmt(dis):"")+"\nالإجمالي: "+fmt(sub()-dis)+
 "\n\nالاسم: "+nm+"\nالهاتف: "+ph+"\nالعنوان: "+ad+"\nالدفع: "+pm+($("#fo").value.trim()?"\nملاحظات: "+$("#fo").value.trim():""),
 u="https://wa.me/"+C.whatsapp+"?text="+encodeURIComponent(t);
 cart=[];save();count();pct=0;
 $("#dbody").innerHTML='<div class="ok"><h3>✅ تم تجهيز طلبك</h3><p>رقم طلبك: <b>'+no+'</b><br>اضغط الزر لإرسال الطلب على واتساب وتأكيده. احتفظ بالرقم للمتابعة.</p><a class="btn" style="display:block;text-decoration:none" target="_blank" rel="noopener" href="'+u+'">إرسال الطلب على واتساب</a></div>';
 window.open(u,"_blank")};
(function(){var a=C.popup;if(!a||!a.enabled)return;try{if(sessionStorage.getItem("bsAd_"+a.id))return}catch(e){}
 $("#pt").textContent=a.title;$("#ptx").textContent=a.text;
 if(a.showCode&&C.coupon.code)$("#pcode").textContent=C.coupon.code;else $("#pcode").hidden=true;
 if(a.image){$("#pimg").src=a.image;$("#pimg").hidden=false}
 var tm;function hide(){$("#pop").hidden=true;clearInterval(tm);try{sessionStorage.setItem("bsAd_"+a.id,"1")}catch(e){}}
 setTimeout(function(){$("#pop").hidden=false;var l=a.duration;$("#ptm").textContent="يُغلق تلقائياً خلال "+l+" ثانية";
  tm=setInterval(function(){l--;if(l<=0){hide();return}$("#ptm").textContent="يُغلق تلقائياً خلال "+l+" ثانية"},1000)},a.showAfter*1000);
 $("#px").onclick=hide;$("#pgo").onclick=hide;$("#pop").onclick=function(e){if(e.target===this)hide()}})();
chips();render();count();
})();

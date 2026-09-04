// size selector
document.querySelectorAll('.size').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.size').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
  });
});

// 3D pack showcase: auto-spin + drag to rotate
(function () {
  var box = document.getElementById('box3d');
  var stage = document.getElementById('showcase');
  if (!box || !stage) return;

  box.classList.add('js');            // hand rotation over to JS (disables CSS keyframes)
  var rotX = -10, rotY = 0;
  var autoSpin = true, dragging = false;
  var startX = 0, startY = 0, startRotX = 0, startRotY = 0;
  var isTouch = false, decided = false;   // touch: wait to see if the swipe is horizontal

  function apply() {
    box.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
  }
  function tick() {
    if (autoSpin && !dragging) { rotY += 0.4; apply(); }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  stage.addEventListener('mouseenter', function () { autoSpin = false; });
  stage.addEventListener('mouseleave', function () { if (!dragging) autoSpin = true; });

  function down(e) {
    isTouch = !!e.touches;
    var p = isTouch ? e.touches[0] : e;
    startX = p.clientX; startY = p.clientY; startRotX = rotX; startRotY = rotY;
    if (isTouch) {
      // don't grab yet — decide on first move so vertical swipes can still scroll
      decided = false;
    } else {
      dragging = true; box.classList.add('dragging'); autoSpin = false;
    }
  }
  function move(e) {
    var p = e.touches ? e.touches[0] : e;
    var dx = p.clientX - startX, dy = p.clientY - startY;
    if (isTouch && !decided) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;   // wait for intent
      decided = true;
      if (Math.abs(dx) > Math.abs(dy)) {                  // horizontal → rotate
        dragging = true; box.classList.add('dragging'); autoSpin = false;
      } else {
        return;                                           // vertical → let page scroll
      }
    }
    if (!dragging) return;
    rotY = startRotY + dx * 0.5;
    rotX = Math.max(-70, Math.min(70, startRotX - dy * 0.4));
    apply();
    if (e.cancelable && !isTouch) e.preventDefault();
    else if (e.cancelable && dragging) e.preventDefault();  // block scroll only while rotating
  }
  function up() {
    if (!dragging) return;
    dragging = false; box.classList.remove('dragging');
    if (!stage.matches(':hover')) autoSpin = true;
  }

  stage.addEventListener('mousedown', down);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', up);
  stage.addEventListener('touchstart', down, { passive: true });
  window.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', up);
})();

// mobile menu: toggle an .open class on the nav (CSS handles the layout)
var burger = document.querySelector('.hamburger');
var nav = document.querySelector('.nav');
if (burger && nav) {
  burger.addEventListener('click', function () {
    nav.classList.toggle('open');
  });
  // close the menu after tapping a link
  nav.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });
}

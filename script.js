// Game: Guess the App by the UI
(function(){

  // 🔥 Use real SVG files
  const DATA = [
    { name: 'Instagram', img: 'assets/insta.jpg' },
    { name: 'TikTok', img: 'assets/tiktok.jpg' },
    { name: 'Spotify', img: 'assets/spotify.jpg' },
    { name: 'Snapchat', img: 'assets/snapchat.jpg' },
    { name: 'YouTube', img: 'assets/youtube.jpg' },
    { name: 'Netflix', img: 'assets/netflix.jpg' }
  ];

  const TOTAL_Q = DATA.length;
  const TIME_LIMIT = 10;

  // DOM
  const uiImage = document.getElementById('uiImage');
  const choicesEl = document.getElementById('choices');
  const scoreEl = document.getElementById('score');
  const timeEl = document.getElementById('time');
  const nextBtn = document.getElementById('nextBtn');
  const shareBtn = document.getElementById('shareBtn');
  const startBtn = document.getElementById('startBtn');
  const startOverlay = document.getElementById('startOverlay');
  const finalOverlay = document.getElementById('finalOverlay');
  const finalScore = document.getElementById('finalScore');
  const totalQ = document.getElementById('totalQ');
  const replayBtn = document.getElementById('replayBtn');
  const closeFinal = document.getElementById('closeFinal');
  const overlayMsg = document.getElementById('overlayMsg');

  let questions = [];
  let current = 0;
  let score = 0;
  let timer = null;
  let timeLeft = TIME_LIMIT;

  function shuffle(a){
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function buildQuestions(){
    const pool = DATA.map(d => ({ name: d.name, img: d.img }));
    shuffle(pool);

    return pool.map(item => {
      const wrong = DATA.filter(d => d.name !== item.name).map(d => d.name);
      shuffle(wrong);

      const options = shuffle([
        item.name,
        wrong[0],
        wrong[1],
        wrong[2]
      ]);

      return { img: item.img, answer: item.name, options };
    });
  }

  function setImage(src){
    uiImage.src = src;
    uiImage.style.filter = 'blur(18px) grayscale(8%)';
  }

  function renderQuestion(){
    const q = questions[current];
    setImage(q.img);

    choicesEl.innerHTML = '';
    q.options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.textContent = opt;
      b.onclick = () => selectAnswer(b, opt);
      choicesEl.appendChild(b);
    });

    nextBtn.disabled = true;
    timeLeft = TIME_LIMIT;
    updateTime();
    startTimer();
  }

  function startTimer(){
    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft -= 0.1;
      if(timeLeft < 0) timeLeft = 0;

      updateTime();

      const blur = Math.max(2, (timeLeft / TIME_LIMIT) * 18);
      uiImage.style.filter = `blur(${blur}px) grayscale(8%)`;

      if(timeLeft <= 0){
        clearInterval(timer);
        onTimeUp();
      }
    }, 100);
  }

  function updateTime(){
    timeEl.textContent = Math.ceil(timeLeft);
    if(timeLeft <= 3 && overlayMsg){
      overlayMsg.textContent = `You got ${Math.ceil(timeLeft)} seconds left 😭`;
    }
  }

  function selectAnswer(btn, opt){
    clearInterval(timer);
    const q = questions[current];
    const allBtns = [...choicesEl.children];

    allBtns.forEach(b => b.disabled = true);

    if(opt === q.answer){
      score++;
      scoreEl.textContent = score;
      btn.classList.add('correct');
      uiImage.style.filter = 'blur(0px)';
    } else {
      btn.classList.add('wrong');
      uiImage.style.filter = 'blur(2px)';
      allBtns.find(b => b.textContent === q.answer)?.classList.add('correct');
    }

    nextBtn.disabled = false;
  }

  function onTimeUp(){
    const allBtns = [...choicesEl.children];
    allBtns.forEach(b => {
      b.disabled = true;
      if(b.textContent === questions[current].answer){
        b.classList.add('correct');
      }
    });

    uiImage.style.filter = 'blur(2px)';
    nextBtn.disabled = false;
  }

  nextBtn.onclick = () => {
    current++;
    current >= questions.length ? endGame() : renderQuestion();
  };

  shareBtn.onclick = () => {
    const text = `I scored ${score}/${TOTAL_Q} on Guess the App by the UI 😭🔥`;
    navigator.clipboard?.writeText(text).then(() =>
      alert('Copied! Go flex on TikTok 😎')
    );
  };

  startBtn.onclick = () => {
    startOverlay.classList.add('hidden');
    startGame();
  };

  replayBtn.onclick = () => {
    finalOverlay.classList.add('hidden');
    startGame();
  };

  closeFinal.onclick = () => finalOverlay.classList.add('hidden');

  function startGame(){
    questions = buildQuestions();
    current = 0;
    score = 0;
    scoreEl.textContent = score;
    totalQ.textContent = TOTAL_Q;
    renderQuestion();
  }

  function endGame(){
    clearInterval(timer);
    finalScore.textContent = score;
    finalOverlay.classList.remove('hidden');
  }

})();

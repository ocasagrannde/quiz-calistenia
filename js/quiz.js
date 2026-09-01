/* ==========================================================================
   QUIZ FUNNEL DE CALISTENIA ASIÁTICA PARA MULHERES - JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Global Quiz State
  const quizState = {
    currentStep: 1,
    totalSteps: 30,
    answers: {
      age: null,
      experience: null,
      goals: [],
      bodyZones: [],
      targetZones: [],
      bodyType: null,
      dreamBody: null,
      bestShapeTime: null,
      limitations: [],
      comfortLevel: null,
      height: 165,
      currentWeight: 72,
      targetWeight: 60,
      bmi: null,
      activityLevel: null,
      energyLevel: null,
      waterIntake: null,
      sleepHours: null,
      dietPreferences: [],
      habits: [],
      lifeEvents: [],
      motivation: null,
      email: ''
    }
  };

  // DOM Elements
  const progressBarFill = document.getElementById('progressBarFill');
  const headerProgressBarContainer = document.getElementById('headerProgressBarContainer');
  const btnBackHeader = document.getElementById('btnBackHeader');
  const headerContainer = document.getElementById('headerContainer');
  const vslTopTimerBar = document.getElementById('vslTopTimerBar');

  // Initialize Event Listeners
  initNavigation();
  initSliders();
  initFaqAccordion();
  initCountdownTimer();
  updateTodayDiscountDate();
  update21DaysTargetDates();
  updateProgressBar(1);

  // Suporte a abertura direta de etapas via URL (ex: ?step=vsl ou #vsl)
  const urlParams = new URLSearchParams(window.location.search);
  const initialStep = urlParams.get('step') || window.location.hash.replace('#', '');
  if (initialStep) {
    showStep(initialStep);
  }

  // Navigation Logic
  function initNavigation() {
    if (btnBackHeader) {
      btnBackHeader.addEventListener('click', goBack);
    }
  }

  function update21DaysTargetDates() {
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 21);
    const dateFormatted = `${targetDate.getDate()} de ${meses[targetDate.getMonth()]}`;

    const targetDateEl = document.getElementById('targetDateText');
    if (targetDateEl) targetDateEl.textContent = dateFormatted;

    const planBurnDateEl = document.getElementById('planBurnDate');
    if (planBurnDateEl) planBurnDateEl.textContent = dateFormatted;
  }

  function updateProgressBar(stepNumber) {
    if (!progressBarFill) return;
    const current = String(stepNumber || quizState.currentStep || '1');
    const hideOnSteps = ['1', '1b', '2', 'vsl'];

    // Nas etapas 1, 1b e 2, a linha fica limpa (0%). A partir da etapa 3 ela preenche a partir do canto esquerdo da tela
    if (hideOnSteps.includes(current)) {
      progressBarFill.style.width = '0%';
      return;
    }

    const stepProgressOrder = [
      '3', '4a', '4b', '5', '5b', '6', '7', '8', '9', '10', 
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', 
      '21', '22', '23', '24', '25', '26', '26b', '26c', '26d', '27', 
      '28', '29', '30'
    ];

    let idx = stepProgressOrder.indexOf(current);
    if (idx === -1) {
      const num = parseInt(current);
      if (!isNaN(num) && num > 2) {
        idx = Math.min(stepProgressOrder.length - 1, num - 3);
      } else {
        idx = 0;
      }
    }

    // A etapa 3 inicia em ~8% e progride suavemente até 100% no resumo da etapa 30
    const pct = Math.min(100, Math.round(((idx + 1) / stepProgressOrder.length) * 94) + 6);
    progressBarFill.style.width = `${pct}%`;
  }

  function updateTodayDiscountDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formatted = `${dd}/${mm}/${yyyy}`;

    const discountEls = document.querySelectorAll('.price-today-discount');
    discountEls.forEach(el => {
      el.textContent = `Desconto válido apenas hoje, ${formatted}`;
    });
  }

  function showStep(stepNumber) {
    const allPanes = document.querySelectorAll('.step-pane');
    allPanes.forEach(pane => pane.classList.remove('active'));

    const targetPane = document.getElementById(`step-${stepNumber}`);
    if (targetPane) {
      targetPane.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (stepNumber === 15) updateRulerGraphic(document.getElementById('heightSlider'));
      if (stepNumber === 16) updateRulerGraphic(document.getElementById('weightSlider'));
      if (stepNumber === 17) updateRulerGraphic(document.getElementById('targetWeightSlider'));
      if (stepNumber === 26) {
        const graphBox = document.getElementById('transformationGraphBox');
        if (graphBox) {
          graphBox.classList.remove('animate-graph');
          void graphBox.offsetWidth;
          setTimeout(() => graphBox.classList.add('animate-graph'), 50);
        }
      }
      if (stepNumber === '26c') {
        const curW = quizState.answers.currentWeight || 73;
        const tarW = quizState.answers.targetWeight || 57;

        const badgeTargetText = document.getElementById('projTargetWeightBadge');
        const badgeTargetVal = document.getElementById('projTargetWeightVal');
        const badgeCurrentVal = document.getElementById('projCurrentWeightVal');

        if (badgeTargetText) badgeTargetText.textContent = `${tarW}kg`;
        if (badgeTargetVal) badgeTargetVal.textContent = `${tarW}kg`;
        if (badgeCurrentVal) badgeCurrentVal.textContent = `${curW}kg`;

        const graphBox = document.getElementById('weightGraphBox');
        if (graphBox) {
          graphBox.classList.remove('animate-weight-graph');
          void graphBox.offsetWidth;
          setTimeout(() => graphBox.classList.add('animate-weight-graph'), 50);
        }
      }
      if (stepNumber === '26d') {
        const heightM = (quizState.answers.height || 165) / 100;
        const weightKg = quizState.answers.currentWeight || 73;
        const bmi = (weightKg / (heightM * heightM)).toFixed(1);

        const markerText = document.getElementById('profileBmiMarkerText');
        const markerPin = document.getElementById('profileBmiPinContainer');
        if (markerText) markerText.textContent = `Você – ${bmi}`;

        let pct = 52;
        if (bmi <= 18.5) {
          pct = ((bmi - 15) / (18.5 - 15)) * 25;
        } else if (bmi <= 25) {
          pct = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
        } else if (bmi <= 30) {
          pct = 50 + ((bmi - 25) / (30 - 25)) * 25;
        } else {
          pct = 75 + Math.min(25, ((bmi - 30) / (40 - 30)) * 25);
        }
        pct = Math.max(5, Math.min(95, pct));

        if (markerPin) markerPin.style.left = `${pct}%`;

        const catAbaixo = document.getElementById('bmiCatAbaixo');
        const catNormal = document.getElementById('bmiCatNormal');
        const catSobrepeso = document.getElementById('bmiCatSobrepeso');
        const catObeso = document.getElementById('bmiCatObeso');

        [catAbaixo, catNormal, catSobrepeso, catObeso].forEach(el => {
          if (el) {
            el.style.color = '#94a3b8';
            el.style.fontWeight = '600';
          }
        });

        if (bmi < 18.5 && catAbaixo) {
          catAbaixo.style.color = '#1e293b';
          catAbaixo.style.fontWeight = '800';
        } else if (bmi < 25 && catNormal) {
          catNormal.style.color = '#1e293b';
          catNormal.style.fontWeight = '800';
        } else if (bmi < 30 && catSobrepeso) {
          catSobrepeso.style.color = '#1e293b';
          catSobrepeso.style.fontWeight = '800';
        } else if (catObeso) {
          catObeso.style.color = '#1e293b';
          catObeso.style.fontWeight = '800';
        }
      }
      if (stepNumber === 28) {
        update21DaysTargetDates();
      }
      if (stepNumber === 30) {
        update21DaysTargetDates();
        const curW = quizState.answers.currentWeight || 73;
        const tarW = quizState.answers.targetWeight || 57;

        const elCurW = document.getElementById('planCurrentWeight');
        const elTarW = document.getElementById('planTargetWeight');

        if (elCurW) elCurW.textContent = `${curW} kg`;
        if (elTarW) elTarW.textContent = `${tarW} kg`;

        // Set focus based on motivation answer
        const motivation = quizState.answers.motivation || 'Confiança';
        const focusMap = {
          'Confiança': 'Autoestima e confiança corporal.',
          'Saúde e energia': 'Saúde, energia e bem-estar.',
          'Roupas': 'Definição corporal e autoestima.',
          'Autoestima pós-parto': 'Recuperação pós-parto e autoestima.',
          'Outro': 'Transformação corporal completa.'
        };
        const elFocus = document.getElementById('planFocusText');
        if (elFocus) elFocus.textContent = focusMap[motivation] || 'Autoestima e confiança corporal.';
      }

      // Check multi-select button states on step entry
      const multiStepMap = {
        '5b': { key: 'extraGoals', btn: 'btnContinueStep5b' },
        '6': { key: 'bodyZones', btn: 'btnContinueStep6' },
        '7': { key: 'targetZones', btn: 'btnContinueStep7' },
        '12': { key: 'limitations', btn: 'btnContinueStep12' },
        '23': { key: 'dietPreferences', btn: 'btnContinueStep23' },
        '24': { key: 'habits', btn: 'btnContinueStep24' },
        '25': { key: 'lifeEvents', btn: 'btnContinueStep25' }
      };
      const cfg = multiStepMap[String(stepNumber)];
      if (cfg) {
        const btn = document.getElementById(cfg.btn);
        const ans = quizState.answers[cfg.key] || [];
        if (btn) {
          if (ans.length > 0) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      }
      if (stepNumber === '1b') {
        const btn = document.getElementById('btnNextExactAge');
        const ageInput = document.getElementById('exactAgeInput');
        if (btn && ageInput) {
          const val = parseInt(ageInput.value);
          if (!isNaN(val) && val >= 10 && val <= 100) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      }
    }

    // Toggle header & top timer bar on VSL page
    if (stepNumber === 'vsl') {
      if (btnBackHeader) btnBackHeader.style.visibility = 'hidden';
      if (headerContainer) headerContainer.style.display = 'none';
      if (vslTopTimerBar) vslTopTimerBar.style.display = 'flex';
      initVTurbPlayer();
      if (window.posthog) window.posthog.capture('vsl_offer_view');
    } else {
      if (btnBackHeader) btnBackHeader.style.visibility = (stepNumber === 1) ? 'hidden' : 'visible';
      if (headerContainer) headerContainer.style.display = 'flex';
      if (vslTopTimerBar) vslTopTimerBar.style.display = 'none';
    }

    // PostHog Step Funnel Tracking
    if (window.posthog) {
      const stepTitle = document.querySelector(`#step-${stepNumber} .step-title`)?.textContent?.trim() || `Etapa ${stepNumber}`;
      if (stepNumber === 30) {
        window.posthog.capture('quiz_completed');
      } else if (stepNumber === '26d') {
        window.posthog.capture('quiz_result_view', { bmi: quizState.answers.bmi });
      }
      window.posthog.capture('quiz_step_view', {
        step_number: String(stepNumber),
        step_title: stepTitle
      });
    }

    quizState.currentStep = stepNumber;
    updateProgressBar(stepNumber);
  }

  function initVTurbPlayer() {
    const container = document.getElementById('vturb-container');
    if (!container) return;

    if (!document.getElementById('vid-69cd7dd6181cf0419855d464')) {
      container.innerHTML = '';
      const playerEl = document.createElement('vturb-smartplayer');
      playerEl.id = 'vid-69cd7dd6181cf0419855d464';
      playerEl.style.cssText = 'display:block;margin:0 auto;width:100%;max-width:400px;border-radius:16px;overflow:hidden;';
      container.appendChild(playerEl);

      const script = document.createElement('script');
      script.src = 'https://scripts.converteai.net/e6e99317-bea5-4278-a04d-e7732bc0fcb1/players/69cd7dd6181cf0419855d464/v4/player.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  function goNext(nextStep) {
    showStep(nextStep);
  }

  function goBack() {
    if (typeof quizState.currentStep === 'number' && quizState.currentStep > 1) {
      showStep(quizState.currentStep - 1);
    }
  }

  // Range Slider & Dynamic Movable Ruler
  function updateRulerGraphic(slider) {
    if (!slider) return;
    const val = parseFloat(slider.value);
    const min = parseFloat(slider.min) || 0;
    const container = slider.closest('.step-pane');
    if (!container) return;

    const ticksBg = container.querySelector('.ruler-ticks-bg');
    if (ticksBg) {
      const offset = (val - min) * -14;
      ticksBg.style.backgroundPositionX = `${offset}px`;
    }

    const posLeft = container.querySelector('.pos-left');
    const posRight = container.querySelector('.pos-right');
    if (posLeft && posRight) {
      const leftVal = Math.floor(val / 10) * 10;
      const rightVal = leftVal + 10;
      posLeft.textContent = leftVal;
      posRight.textContent = rightVal;
    }
  }

  function initSliders() {
    // Height Slider
    const heightSlider = document.getElementById('heightSlider');
    const heightValue = document.getElementById('heightValue');
    if (heightSlider && heightValue) {
      updateRulerGraphic(heightSlider);
      heightSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        heightValue.textContent = val;
        quizState.answers.height = parseInt(val);
        updateRulerGraphic(e.target);
      });
    }

    // Current Weight Slider
    const weightSlider = document.getElementById('weightSlider');
    const weightValue = document.getElementById('weightValue');
    if (weightSlider && weightValue) {
      updateRulerGraphic(weightSlider);
      weightSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        weightValue.textContent = val;
        quizState.answers.currentWeight = parseFloat(val);
        updateRulerGraphic(e.target);
      });
    }

    // Target Weight Slider
    const targetWeightSlider = document.getElementById('targetWeightSlider');
    const targetWeightValue = document.getElementById('targetWeightValue');
    if (targetWeightSlider && targetWeightValue) {
      updateRulerGraphic(targetWeightSlider);
      targetWeightSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        targetWeightValue.textContent = val;
        quizState.answers.targetWeight = parseFloat(val);
        updateRulerGraphic(e.target);
      });
    }
  }

  // Calculate BMI and Alert Category
  function calculateBmi() {
    const h = quizState.answers.height / 100;
    const w = quizState.answers.currentWeight;
    if (h > 0 && w > 0) {
      const bmiVal = (w / (h * h)).toFixed(1);
      quizState.answers.bmi = parseFloat(bmiVal);

      const alertTitleEl = document.getElementById('alertTitle');
      const alertDescEl = document.getElementById('alertDesc');
      const bmiDisplayEl = document.getElementById('bmiDisplayVal');

      if (bmiDisplayEl) bmiDisplayEl.textContent = bmiVal;

      if (alertTitleEl && alertDescEl) {
        if (bmiVal < 20) {
          alertTitleEl.textContent = 'Alerta de Fragilidade Metabólica:';
          alertDescEl.textContent = 'Embora seu peso seja baixo, seu metabolismo está desequilibrado. A falta de estímulo nas fibras profundas causa perda de tônus e fragilidade interna. O Protocolo Asiático é essencial para fortalecer sua base e garantir um corpo firme, saudável e funcional.';
        } else if (bmiVal >= 20 && bmiVal < 25) {
          alertTitleEl.textContent = 'Alerta de Estagnação:';
          alertDescEl.textContent = 'Cuidado com o efeito "falsa magra". Seu peso está normal, mas seu metabolismo está estagnado. Sem a ativação das fibras profundas, o corpo acumula gordura visceral e perde a definição. Você precisa destravar sua queima natural agora para evitar a flacidez.';
        } else if (bmiVal >= 25 && bmiVal < 30) {
          alertTitleEl.textContent = 'Alerta de Bloqueio:';
          alertDescEl.textContent = 'Seu metabolismo entrou em modo de resistência. O excesso de peso está sobrecarregando suas articulações e travando sua energia diária. O segredo para voltar a secar é a ativação rítmica das fibras profundas sem o esforço exaustivo da academia.';
        } else {
          alertTitleEl.textContent = 'Alerta de Risco Urgente:';
          alertDescEl.textContent = 'Seu metabolismo está em "modo de sobrevivência", travando a queima e gerando inflamação. A Calistenia Asiática é a única via segura para destravar seu sistema e eliminar gordura de forma rápida, sem impacto e sem exaustão.';
        }
      }
    }
  }

  // Animation calculation screen
  function runCalculationLoader(onComplete) {
    let progress = 0;
    const progressText = document.getElementById('calcPercentText');
    const circleFill = document.getElementById('calcCircleFill');
    const calcSubText = document.getElementById('calcSubText');

    const statusMessages = [
      'Analisando sua faixa etária e metabolismo...',
      'Calculando Índice de Massa Corporal (IMC)...',
      'Ajustando séries sem impacto para suas articulações...',
      'Gerando plano personalizado de Calistenia Asiática...'
    ];

    const interval = setInterval(() => {
      progress += 2;
      if (progressText) progressText.textContent = `${progress}%`;
      
      if (circleFill) {
        const offset = 408 - (408 * progress / 100);
        circleFill.style.strokeDashoffset = offset;
      }

      if (calcSubText) {
        if (progress < 25) calcSubText.textContent = statusMessages[0];
        else if (progress < 50) calcSubText.textContent = statusMessages[1];
        else if (progress < 75) calcSubText.textContent = statusMessages[2];
        else calcSubText.textContent = statusMessages[3];
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 40);
  }

  // Countdown Timer for VSL Offer (10:00 minutes)
  function initCountdownTimer() {
    let duration = 10 * 60;
    const timerDisplay = document.getElementById('vslTimerDisplay');

    if (!timerDisplay) return;

    const timerInterval = setInterval(() => {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;

      const mStr = minutes < 10 ? `0${minutes}` : minutes;
      const sStr = seconds < 10 ? `0${seconds}` : seconds;

      timerDisplay.textContent = `${mStr}:${sStr}`;

      if (--duration < 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "00:00";
      }
    }, 1000);
  }

  // Accordion FAQ Toggle
  function initFaqAccordion() {
    const faqButtons = document.querySelectorAll('.faq-question');
    faqButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        item.classList.toggle('open');
      });
    });
  }

  // Global Option Select Handlers
  window.validateAgeInput = function(input) {
    const val = parseInt(input.value);
    const btn = document.getElementById('btnNextExactAge');
    if (!isNaN(val) && val >= 10 && val <= 100) {
      quizState.answers.exactAge = val;
      if (window.posthog) {
        window.posthog.capture('quiz_question_answered', {
          step_number: '1b',
          question_key: 'exact_age',
          answer: val
        });
      }
      if (btn) btn.classList.add('active');
    } else {
      if (btn) btn.classList.remove('active');
    }
  };

  window.toggleUnitPill = function(btnElement, targetLabelId, unitName) {
    const parent = btnElement.parentElement;
    if (parent) {
      const pills = parent.querySelectorAll('.unit-pill');
      pills.forEach(p => p.classList.remove('active'));
    }
    btnElement.classList.add('active');
    const labelEl = document.getElementById(targetLabelId);
    if (labelEl) {
      labelEl.textContent = unitName;
    }
  };

  window.selectSingleOption = function(key, value, nextStep) {
    quizState.answers[key] = value;
    
    if (window.posthog) {
      if (quizState.currentStep === 1) {
        window.posthog.capture('quiz_started', { initial_answer: value });
      }
      window.posthog.capture('quiz_question_answered', {
        step_number: String(quizState.currentStep),
        question_key: key,
        answer: value
      });
    }

    if (key === 'experience') {
      if (value === 'Sim') goNext('4a');
      else goNext('4b');
      return;
    }

    if (key === 'comfortLevel') {
      const feedbackDor = document.getElementById('comfortFeedbackDor');
      const feedbackConfortavel = document.getElementById('comfortFeedbackConfortavel');
      if (feedbackDor && feedbackConfortavel) {
        if (value === 'confortavel') {
          feedbackDor.style.display = 'none';
          feedbackConfortavel.style.display = 'block';
        } else {
          feedbackDor.style.display = 'block';
          feedbackConfortavel.style.display = 'none';
        }
      }
    }

    goNext(nextStep);
  };

  window.toggleGridCard = function(element, key, value, btnId) {
    element.classList.toggle('selected');
    const arr = quizState.answers[key] || [];
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    } else {
      arr.push(value);
    }
    quizState.answers[key] = arr;

    if (window.posthog) {
      window.posthog.capture('quiz_question_answered', {
        step_number: String(quizState.currentStep),
        question_key: key,
        answer: arr
      });
    }

    if (btnId) {
      const btn = document.getElementById(btnId);
      if (btn) {
        if (arr.length > 0) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    }
  };

  window.handleNextStep = function(stepNumber) {
    if (stepNumber === 24) {
      const diet = quizState.answers.dietPreferences || [];
      if (diet.length === 0) return;
    }
    if (stepNumber === 18 || stepNumber === 19) {
      calculateBmi();
    }

    if (window.posthog) {
      if (quizState.currentStep === 15) {
        window.posthog.capture('quiz_question_answered', { step_number: 15, question_key: 'height', answer: quizState.answers.height });
      } else if (quizState.currentStep === 16) {
        window.posthog.capture('quiz_question_answered', { step_number: 16, question_key: 'currentWeight', answer: quizState.answers.currentWeight });
      } else if (quizState.currentStep === 17) {
        window.posthog.capture('quiz_question_answered', { step_number: 17, question_key: 'targetWeight', answer: quizState.answers.targetWeight });
      }
    }

    goNext(stepNumber);
  };

  window.handleLoaderStep = function() {
    showStep(29);
    runCalculationLoader(() => {
      showStep(30);
    });
  };

  let planLoaderInterval = null;
  let planCarouselInterval = null;
  window.loaderPhotos = [
    'assets/loader-transform-1.jpg',
    'assets/loader-transform-2.png',
    'assets/loader-transform-3.png',
    'assets/beatriz-tonificado-Otd2-Vi6.webp'
  ];

  window.startPlanLoaderStep = function(nextStepTarget = 27) {
    showStep('26b');

    const fill = document.getElementById('planLoadingBarFill');
    const text = document.getElementById('planLoadingPercentText');
    const img = document.getElementById('loaderCarouselImg');

    let percent = 0;
    let photoIdx = 0;

    if (fill) fill.style.width = '0%';
    if (text) text.textContent = '0%';
    if (img && window.loaderPhotos.length > 0) img.src = window.loaderPhotos[0];

    if (planLoaderInterval) clearInterval(planLoaderInterval);
    if (planCarouselInterval) clearInterval(planCarouselInterval);

    // Photos carousel transition every 3.0 seconds (mais lento)
    planCarouselInterval = setInterval(() => {
      if (window.loaderPhotos.length > 0 && img) {
        photoIdx = (photoIdx + 1) % window.loaderPhotos.length;
        img.style.opacity = '0.2';
        setTimeout(() => {
          img.src = window.loaderPhotos[photoIdx];
          img.style.opacity = '1';
        }, 200);
      }
    }, 3000);

    // Progress bar from 0% to 100% in ~13 seconds (130ms * 100)
    planLoaderInterval = setInterval(() => {
      percent += 1;
      if (fill) fill.style.width = `${percent}%`;
      if (text) text.textContent = `${percent}%`;

      if (percent >= 100) {
        clearInterval(planLoaderInterval);
        clearInterval(planCarouselInterval);
        setTimeout(() => {
          showStep(nextStepTarget);
        }, 300);
      }
    }, 130);
  };

  window.handleEmailSubmit = function(e) {
    if (e) e.preventDefault();
    const emailInput = document.getElementById('leadEmailInput');
    if (emailInput && emailInput.value) {
      quizState.answers.email = emailInput.value;
      if (window.posthog) {
        window.posthog.identify(emailInput.value, { email: emailInput.value });
        window.posthog.capture('quiz_lead_submitted', { email: emailInput.value });
      }
    }
    showStep('vsl');
  };

  // Attach PostHog event to checkout buttons
  function initCheckoutTracking() {
    const ctaButtons = document.querySelectorAll('a.btn-vsl-cta');
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.posthog) {
          window.posthog.capture('checkout_button_clicked', {
            button_text: btn.textContent.trim(),
            destination: btn.getAttribute('href')
          });
        }
      });
    });
  }

  initCheckoutTracking();

  window.showStep = showStep;

  // Initial step setup
  showStep(1);
});

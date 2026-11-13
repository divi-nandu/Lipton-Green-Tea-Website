document.addEventListener("DOMContentLoaded", function () {

    console.log("Lipton Green Tea Website Loaded Successfully!");

    // =====================================
    // 1. AI TEA EXPERIENCE - MOOD SELECTOR
    // =====================================

    const moodButtons = document.querySelectorAll(".mood-btn");

    const recTitle = document.querySelector("#recommendation-title");
    const recSub = document.querySelector("#recommendation-sub");
    const recTags = document.querySelector("#recommendation-tags");
    const recDescription = document.querySelector("#recommendation-description");
    const recImage = document.querySelector("#recommendation-image");
    const aiMessageText = document.querySelector("#ai-message-text");

    // Tea recommendation for each mood
    const teaRecommendations = {
        relaxed: {
            title: "GREEN TEA", sub: "with Mint",
            tags: ["Refreshing", "Light", "Calming"],
            description: "A refreshing blend that helps you relax and feel light.",
            image: "images/mint-green-tea.png",
            message: "A calm moment sounds perfect! Try Green Tea with Mint."
        },
        energetic: {
            title: "GREEN TEA", sub: "classic",
            tags: ["Fresh", "Light", "Active"],
            description: "A light and refreshing choice for your active day.",
            image: "images/green-tea.png",
            message: "Ready for the day! Green Tea is a fresh choice."
        },
        stressed: {
            title: "HERBAL TEA", sub: "chamomile",
            tags: ["Calming", "Natural", "Caffeine Free"],
            description: "Take a pause and enjoy a comforting herbal tea.",
            image: "images/herbal-tea.png",
            message: "Let's slow things down. Herbal Tea can help you unwind."
        },
        sad: {
            title: "PEACH TEA", sub: "fruity",
            tags: ["Sweet", "Fruity", "Bright"],
            description: "A fruity cup to add a little brightness to your moment.",
            image: "images/peach-tea.png",
            message: "Everyone needs comfort sometimes. Peach Tea can brighten your moment."
        },
        focused: {
            title: "MATCHA TEA", sub: "smooth",
            tags: ["Vibrant", "Smooth", "Focus"],
            description: "A vibrant tea to go with your focus time.",
            image: "images/matcha-tea.png",
            message: "Time to focus! Matcha Tea is a great choice."
        },
        happy: {
            title: "HIBISCUS TEA", sub: "fruity",
            tags: ["Colourful", "Fruity", "Tangy"],
            description: "A colourful infusion to celebrate your happy moment.",
            image: "images/hibiscus-tea.png",
            message: "Love that happy mood! Enjoy a cup of Hibiscus Tea."
        }
    };

    function showRecommendation(mood) {
        const rec = teaRecommendations[mood];
        if (!rec) return;

        if (recTitle) recTitle.textContent = rec.title;
        if (recSub) recSub.textContent = rec.sub;
        if (recDescription) recDescription.textContent = rec.description;
        if (aiMessageText) aiMessageText.textContent = rec.message;

        if (recTags) {
            recTags.innerHTML = "";
            rec.tags.forEach(function (tag) {
                const span = document.createElement("span");
                span.textContent = tag;
                recTags.appendChild(span);
            });
        }

        if (recImage) {
            recImage.hidden = false;
            recImage.src = rec.image;
            recImage.alt = rec.title + " " + rec.sub;
        }
    }

moodButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            moodButtons.forEach(function (item) {
                item.classList.remove("active");
                item.setAttribute("aria-pressed", "false");
            });
            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");
            showRecommendation(button.dataset.mood);
        });
    });

    if (recImage) {
        recImage.addEventListener("error", function () { recImage.hidden = true; });
        recImage.addEventListener("load", function () { recImage.hidden = false; });
    }


    // =====================================
    // 2. TEA CAROUSEL
    // =====================================

    const teaCarousel = document.querySelector("#tea-carousel");
    const previousButton = document.querySelector("#tea-prev");
    const nextButton = document.querySelector("#tea-next");
    const carouselIndicator = document.querySelector("#carousel-indicator");


    if (teaCarousel && previousButton && nextButton) {

        const teaCards = teaCarousel.querySelectorAll(".tea-card");


        // Calculate how far the carousel should scroll

        function getScrollAmount() {

            if (teaCards.length === 0) {
                return 280;
            }

            const cardWidth = teaCards[0].getBoundingClientRect().width;

            const carouselStyle = window.getComputedStyle(teaCarousel);

            const gap =
                parseFloat(carouselStyle.columnGap) ||
                parseFloat(carouselStyle.gap) ||
                22;

            return cardWidth + gap;

        }


        // Update carousel arrows and indicator

        function updateCarouselControls() {

            const maxScroll =
                teaCarousel.scrollWidth - teaCarousel.clientWidth;

            const currentScroll = teaCarousel.scrollLeft;

            const atStart = currentScroll <= 2;
            const atEnd = currentScroll >= maxScroll - 2;


            // Enable or disable navigation arrows

            previousButton.disabled = atStart;
            nextButton.disabled = atEnd;

            previousButton.setAttribute("aria-disabled", atStart);
            nextButton.setAttribute("aria-disabled", atEnd);


            // Find the visible tea cards

            let firstVisible = 0;
            let lastVisible = 0;

            const carouselLeft = teaCarousel.scrollLeft;
            const carouselRight =
                carouselLeft + teaCarousel.clientWidth;


            teaCards.forEach(function (card, index) {

                const cardLeft = card.offsetLeft;
                const cardRight = cardLeft + card.offsetWidth;

                if (
                    cardRight > carouselLeft + 2 &&
                    cardLeft < carouselRight - 2
                ) {

                    if (firstVisible === 0) {
                        firstVisible = index + 1;
                    }

                    lastVisible = index + 1;

                }

            });


            // Display carousel position

            if (carouselIndicator) {

                carouselIndicator.textContent =
                    "Showing " + firstVisible + "–" +
                    lastVisible + " of " + teaCards.length + " teas";

            }

        }


        // Next arrow

        nextButton.addEventListener("click", function () {

            teaCarousel.scrollBy({
                left: getScrollAmount(),
                behavior: "smooth"
            });

        });


        // Previous arrow

        previousButton.addEventListener("click", function () {

            teaCarousel.scrollBy({
                left: -getScrollAmount(),
                behavior: "smooth"
            });

        });


        // Update controls while scrolling

        teaCarousel.addEventListener("scroll", updateCarouselControls);


        // Update controls when screen size changes

        window.addEventListener("resize", updateCarouselControls);


        // Set initial carousel position

        updateCarouselControls();

    }



    // =====================================
    // 3. AI DAILY TEA PLANNER
    // =====================================

    const plannerForm = document.querySelector("#planner-form");
    const plannerInput = document.querySelector("#planner-input");
    const plannerChat = document.querySelector("#planner-chat");


    // Predefined planner responses

    const plannerResponses = {

        morning:
            "Good morning! ☀️ Start your day with a refreshing Green Tea. Enjoy a peaceful moment before beginning your routine.",

        afternoon:
            "Time for an afternoon break! 🍋 Try Lemon Tea or Iced Tea for a refreshing moment during your busy day.",

        evening:
            "It's time to unwind. 🌿 Try Herbal Tea or Mint Tea and enjoy a relaxed evening.",

        daily:
            "Here is your simple tea plan! ☀️ Morning: Green Tea. 🍋 Afternoon: Lemon Tea or Iced Tea. 🌿 Evening: Herbal Tea. Make every moment your own!",

        tired:
            "That sounds intense! I recommend Chamomile Herbal Tea. It helps you relax and unwind.",

        relaxed:
            "Looking for a peaceful moment? 🌿 Try Mint Green Tea or Herbal Tea and enjoy a little break.",

        energetic:
            "Feeling energetic? ⚡ Green Tea is a refreshing choice for your active day.",

        focused:
            "Need a focus break? 🎯 Try Matcha Tea while enjoying your work or study session.",

        fruity:
            "In the mood for something fruity? 🍑 Try Peach Tea or Hibiscus Tea.",

        mint:
            "Love mint flavours? 🌱 Mint Tea or Mint Green Tea could be a refreshing choice.",

        default:
            "That's a lovely tea question! ☕ Explore our tea collection and choose a flavour that matches your mood. You can also ask me about morning, afternoon or evening tea routines."

    };


    // Add a message to the chat window

    function addChatMessage(message, sender) {

        if (!plannerChat) {
            return;
        }

        const isUser = sender === "user";

        // Row that holds avatar + message
        const row = document.createElement("div");
        row.classList.add("chat-row", isUser ? "user-row" : "bot-row");

        // Message bubble
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message");
        messageElement.classList.add(isUser ? "user-message" : "assistant-message");
        messageElement.textContent = message;

        // Avatar (human icon or robot image)
        const avatar = document.createElement("span");
        avatar.classList.add("chat-avatar", isUser ? "user-avatar" : "bot-avatar");

        if (isUser) {
            const icon = document.createElement("i");
            icon.className = "bi bi-person-fill";
            avatar.appendChild(icon);
        } else {
            const robot = document.createElement("img");
            robot.src = "images/robot.svg";
            robot.alt = "Tea bot";
            avatar.appendChild(robot);
        }

        // Bot: avatar then message. User: message then avatar.
        if (isUser) {
            row.appendChild(messageElement);
            row.appendChild(avatar);
        } else {
            row.appendChild(avatar);
            row.appendChild(messageElement);
        }

        plannerChat.appendChild(row);
        plannerChat.scrollTop = plannerChat.scrollHeight;

    }


    // Find a response based on the user's question

    function getPlannerResponse(question) {

        const text = question.toLowerCase().trim();


        if (
            text.includes("full day") ||
            text.includes("daily") ||
            text.includes("whole day") ||
            text.includes("plan")
        ) {
            return plannerResponses.daily;
        }


        if (text.includes("morning")) {
            return plannerResponses.morning;
        }


        if (text.includes("afternoon")) {
            return plannerResponses.afternoon;
        }


        if (
            text.includes("evening") ||
            text.includes("relax") ||
            text.includes("night")
        ) {
            return plannerResponses.evening;
        }


        if (
            text.includes("tired") ||
            text.includes("long day") ||
            text.includes("exhaust")
        ) {
            return plannerResponses.tired;
        }


        if (
            text.includes("stress") ||
            text.includes("calm") ||
            text.includes("peaceful")
        ) {
            return plannerResponses.relaxed;
        }


        if (
            text.includes("energy") ||
            text.includes("energetic") ||
            text.includes("active")
        ) {
            return plannerResponses.energetic;
        }


        if (
            text.includes("focus") ||
            text.includes("study") ||
            text.includes("work")
        ) {
            return plannerResponses.focused;
        }


        if (
            text.includes("fruit") ||
            text.includes("peach") ||
            text.includes("hibiscus")
        ) {
            return plannerResponses.fruity;
        }


        if (text.includes("mint")) {
            return plannerResponses.mint;
        }


        return plannerResponses.default;

    }


    // Handle the user's question

    function handlePlannerQuestion(question) {

        const cleanQuestion = question.trim();


        // Check for empty input

        if (!cleanQuestion) {

            addChatMessage(
                "Please type a question or choose one of the suggestions above. ☕",
                "assistant"
            );

            return;

        }


        // Display user's message

        addChatMessage(cleanQuestion, "user");


        // Display the matching planner response

        const response = getPlannerResponse(cleanQuestion);

        addChatMessage(response, "assistant");

    }


    // Handle typed questions

    if (plannerForm && plannerInput && plannerChat) {

        plannerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const question = plannerInput.value;

            handlePlannerQuestion(question);

            plannerInput.value = "";

            plannerInput.focus();

        });

    }


    // Handle quick suggestion buttons

    const plannerSuggestionButtons =
        document.querySelectorAll(".planner-suggestion");


    plannerSuggestionButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const question = button.dataset.question || "";

            handlePlannerQuestion(question);

        });

    });


    // =====================================
    // 4. FOOTER - EMAIL SUBSCRIBE
    // =====================================

    const subscribeForm = document.querySelector("#subscribe-form");
    const subscribeEmail = document.querySelector("#subscribe-email");
    const subscribeMessage = document.querySelector("#subscribe-message");

    if (subscribeForm && subscribeEmail && subscribeMessage) {

        subscribeForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const email = subscribeEmail.value.trim();
            const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!validEmail) {
                subscribeMessage.textContent = "Please enter a valid email.";
                return;
            }

            subscribeMessage.textContent = "Thank you! You are on the list. ☕";
            subscribeEmail.value = "";

        });

    }


    // =====================================
    // 5. NAVBAR - MOVING DOT (CLICK + SCROLL)
    // =====================================

    const navLinks = document.querySelectorAll(".lipton-navbar .nav-link");
    let navLockUntil = 0;

    function setActiveNav(link) {
        navLinks.forEach(function (item) {
            item.classList.remove("active");
        });
        if (link) {
            link.classList.add("active");
        }
    }

    // Move the dot when a link is clicked
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            setActiveNav(link);
            navLockUntil = Date.now() + 900; // ignore scroll while page is moving
        });
    });

    // Move the dot while scrolling
    const spySections = ["home", "ai-experience", "teas", "moments"];

    function updateNavOnScroll() {

        if (Date.now() < navLockUntil) {
            return;
        }

        const position = window.scrollY + 140;
        let currentId = "home";

        spySections.forEach(function (id) {
            const section = document.getElementById(id);
            if (section && section.offsetTop <= position) {
                currentId = id;
            }
        });

        const matchingLink = document.querySelector(
            '.lipton-navbar .nav-link[href="#' + currentId + '"]'
        );

        setActiveNav(matchingLink);

    }

    window.addEventListener("scroll", updateNavOnScroll);
    updateNavOnScroll();


});
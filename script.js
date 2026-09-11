// ==========================================
// FASTAPI URL
// ==========================================

const API_BASE = "http://127.0.0.1:8000";


// ==========================================
// GET ELEMENTS
// ==========================================

const form = document.getElementById("mentalHealthForm");

const stressButtons =
    document.querySelectorAll(".stress-buttons button");

const stressInput =
    document.getElementById("stress_level");

const predictButton =
    document.querySelector(".predict-btn");

const buttonText =
    document.getElementById("buttonText");

const idleState =
    document.getElementById("idleState");

const loadingState =
    document.getElementById("loadingState");

const resultState =
    document.getElementById("resultState");

const errorState =
    document.getElementById("errorState");

const scoreElement =
    document.getElementById("score");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const errorMessage =
    document.getElementById("errorMessage");

const retryBtn =
    document.getElementById("retryBtn");

const reloadBtn =
    document.getElementById("reloadBtn");

const signalBadge =
    document.getElementById("signalBadge");

const signalThought =
    document.getElementById("signalThought");

const thoughtBox =
    document.querySelector(".signal-thought");

const scoreCircle =
    document.querySelector(".score-circle");


// ==========================================
// STRESS BUTTONS
// ==========================================

stressButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active from all buttons
        stressButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Add active to clicked button
        button.classList.add("active");


        // Save stress value
        stressInput.value =
            button.dataset.value;

    });

});


// ==========================================
// SHOW STATE
// ==========================================

function showState(state) {

    idleState.classList.add("hidden");

    loadingState.classList.add("hidden");

    resultState.classList.add("hidden");

    errorState.classList.add("hidden");


    if (state === "idle") {

        idleState.classList.remove("hidden");

    }

    else if (state === "loading") {

        loadingState.classList.remove("hidden");

    }

    else if (state === "result") {

        resultState.classList.remove("hidden");

    }

    else if (state === "error") {

        errorState.classList.remove("hidden");

    }

}


// ==========================================
// SHOW SIGNAL
// ==========================================

function showSignal(score) {

    // Remove old classes

    signalBadge.classList.remove(
        "strong",
        "medium",
        "low"
    );

    thoughtBox.classList.remove(
        "strong",
        "medium",
        "low"
    );

    scoreCircle.classList.remove(
        "strong",
        "medium",
        "low"
    );


    // ======================================
    // STRONG
    // ======================================

    if (score >= 7) {

        signalBadge.textContent =
            "🟢 Strong Signal";

        signalBadge.classList.add("strong");

        thoughtBox.classList.add("strong");

        scoreCircle.classList.add("strong");


        resultTitle.textContent =
            "Positive Wellness Signal";


        resultMessage.textContent =
            "Your predicted score shows a strong wellness signal.";


        signalThought.textContent =
            "Your habits show a positive wellness signal. Keep maintaining this healthy balance.";

    }


    // ======================================
    // MEDIUM
    // ======================================

    else if (score >= 4) {

        signalBadge.textContent =
            "🟡 Medium Signal";

        signalBadge.classList.add("medium");

        thoughtBox.classList.add("medium");

        scoreCircle.classList.add("medium");


        resultTitle.textContent =
            "Moderate Wellness Signal";


        resultMessage.textContent =
            "Your predicted score shows a moderate wellness signal.";


        signalThought.textContent =
            "Your wellness signal is moderate. Try maintaining a healthy balance between sleep, activity and digital habits.";

    }


    // ======================================
    // LOW
    // ======================================

    else {

        signalBadge.textContent =
            "🔴 Low Signal";

        signalBadge.classList.add("low");

        thoughtBox.classList.add("low");

        scoreCircle.classList.add("low");


        resultTitle.textContent =
            "Low Wellness Signal";


        resultMessage.textContent =
            "Your predicted score shows a lower wellness signal.";


        signalThought.textContent =
            "Consider giving more attention to rest, physical activity and healthy digital habits.";

    }

}


// ==========================================
// FORM SUBMIT
// ==========================================

form.addEventListener(
    "submit",
    async function(event) {

        // Stop page refresh
        event.preventDefault();


        // ======================================
        // STRESS VALIDATION
        // ======================================

        if (stressInput.value === "") {

            alert(
                "Please select your stress level."
            );

            return;

        }


        // ======================================
        // SHOW LOADING
        // ======================================

        showState("loading");

        predictButton.disabled = true;

        predictButton.classList.add("loading");

        buttonText.textContent =
            "Analyzing...";


        // ======================================
        // CREATE DATA
        // ======================================

        const data = {

            age: Number(
                document.getElementById("age").value
            ),

            gender:
                document.getElementById("gender").value,

            country:
                document.getElementById("country").value,

            academic_level:
                document.getElementById(
                    "academic_level"
                ).value,

            most_used_platform:
                document.getElementById(
                    "most_used_platform"
                ).value,

            purpose_of_use:
                document.getElementById(
                    "purpose_of_use"
                ).value,

            avg_daily_usage_hours:
                Number(
                    document.getElementById(
                        "avg_daily_usage_hours"
                    ).value
                ),

            daily_unlocks:
                Number(
                    document.getElementById(
                        "daily_unlocks"
                    ).value
                ),

            study_hours:
                Number(
                    document.getElementById(
                        "study_hours"
                    ).value
                ),

            physical_activity_hours:
                Number(
                    document.getElementById(
                        "physical_activity_hours"
                    ).value
                ),

            sleep_hours_per_night:
                Number(
                    document.getElementById(
                        "sleep_hours_per_night"
                    ).value
                ),

            stress_level:
                stressInput.value

        };


        console.log(
            "Data sent to FastAPI:",
            data
        );


        // ======================================
        // SEND DATA TO FASTAPI
        // ======================================

        try {

            const response = await fetch(
                `${API_BASE}/predict`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                }
            );

            // ======================================
            // CHECK SERVER RESPONSE
            // ======================================

            if (!response.ok) {

                let errorText =
                    "Unable to generate prediction.";


                try {

                    const errorData =
                        await response.json();


                    console.log(
                        "FastAPI error:",
                        errorData
                    );


                    if (errorData.detail) {

                        if (
                            Array.isArray(
                                errorData.detail
                            )
                        ) {

                            errorText =
                                errorData.detail
                                    .map(
                                        function(error) {
                                            return error.msg;
                                        }
                                    )
                                    .join(", ");
                        }

                        else {

                            errorText =
                                errorData.detail;

                        }

                    }

                }

                catch (error) {

                    console.log(
                        "Could not read server error."
                    );

                }


                throw new Error(errorText);

            }

            // ======================================
            // GET JSON RESULT
            // ======================================

            const result =
                await response.json();


            console.log(
                "FastAPI response:",
                result
            );

            // ======================================
            // GET SCORE
            // ======================================

            const predictedScore =
                Number(
                    result.predicted_mental_health_score
                );


            // Check score
            if (isNaN(predictedScore)) {

                throw new Error(
                    "Invalid score received from FastAPI."
                );

            }


            // ======================================
            // DISPLAY SCORE
            // ======================================

            scoreElement.textContent =
                predictedScore.toFixed(2);


            // ======================================
            // DISPLAY SIGNAL
            // ======================================

            showSignal(predictedScore);


            // ======================================
            // SHOW RESULT
            // ======================================

            showState("result");

        }


        // ======================================
        // ERROR
        // ======================================

        catch (error) {

            console.error(
                "Prediction error:",
                error
            );


            errorMessage.textContent =
                error.message ||
                "Unable to connect to FastAPI server.";


            showState("error");

        }


        // ======================================
        // FINISH
        // ======================================

        finally {

            predictButton.disabled = false;

            predictButton.classList.remove(
                "loading"
            );

            buttonText.textContent =
                "Predict Mental Health Score";

        }

    }
);


// ==========================================
// RETRY BUTTON
// ==========================================

retryBtn.addEventListener(
    "click",
    function() {

        showState("idle");

    }
);


// ==========================================
// RELOAD BUTTON
// ==========================================

reloadBtn.addEventListener(
    "click",
    function() {

        // Reset form
        form.reset();


        // Reset stress
        stressInput.value = "";


        // Remove active stress
        stressButtons.forEach(
            function(button) {

                button.classList.remove(
                    "active"
                );

            }
        );


        // Remove signal colors
        signalBadge.classList.remove(
            "strong",
            "medium",
            "low"
        );

        thoughtBox.classList.remove(
            "strong",
            "medium",
            "low"
        );

        scoreCircle.classList.remove(
            "strong",
            "medium",
            "low"
        );


        // Reset score
        scoreElement.textContent =
            "--";


        // Reset signal
        signalBadge.textContent =
            "SIGNAL";


        signalThought.textContent =
            "Your wellness thought will appear here.";


        // Reset title
        resultTitle.textContent =
            "Prediction Complete";


        // Reset message
        resultMessage.textContent =
            "Your predicted mental health score is shown above.";


        // Show idle screen
        showState("idle");

    }
);

// ==========================================
// API CONNECTION CHECK
// ==========================================

console.log(
    "Frontend connected to:",
    API_BASE
);
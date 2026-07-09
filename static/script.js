async function predict() {

    const resultBox = document.getElementById("result");
    const button = document.querySelector(".button-group button");

    // Collect input values
    const data = {
        age: Number(document.getElementById("age").value),
        sex: Number(document.getElementById("sex").value),
        cp: Number(document.getElementById("cp").value),
        trestbps: Number(document.getElementById("trestbps").value),
        chol: Number(document.getElementById("chol").value),
        fbs: Number(document.getElementById("fbs").value),
        restecg: Number(document.getElementById("restecg").value),
        thalach: Number(document.getElementById("thalach").value),
        exang: Number(document.getElementById("exang").value),
        oldpeak: Number(document.getElementById("oldpeak").value),
        slope: Number(document.getElementById("slope").value),
        ca: Number(document.getElementById("ca").value),
        thal: Number(document.getElementById("thal").value)
    };

    // Check empty fields
    for (const key in data) {
        if (isNaN(data[key])) {
            resultBox.className = "result";

            resultBox.innerHTML = `
                <h2 style="color:red;">❌ Please fill all fields.</h2>
            `;
            return;
        }
    }

    // Disable button
    button.disabled = true;

    button.innerHTML = `
        <span class="spinner"></span>
        Analyzing...
    `;

    resultBox.className = "result";

    resultBox.innerHTML = `
        <h2>⏳ Analyzing Patient Data...</h2>
    `;

    try {

        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // Enable button again
        button.disabled = false;
        button.innerHTML = "❤️ Predict Heart Risk";

        if (result.error) {

            resultBox.className = "result";

            resultBox.innerHTML = `
                <h2 style="color:red;">❌ ${result.error}</h2>
            `;

            return;
        }

        // Dataset: prediction = 1 → Low Risk
        if (result.prediction === 1) {

            resultBox.className = "result low-risk";

            resultBox.innerHTML = `
                <div class="success">
                    <h2>✅ Low Risk of Heart Disease</h2>
                    <p><strong>Confidence:</strong> ${result.probability}%</p>
                    <p>❤️ Keep maintaining a healthy lifestyle.</p>
                </div>
            `;

        }

        // prediction = 0 → High Risk
        else {

            resultBox.className = "result high-risk";

            resultBox.innerHTML = `
                <div class="danger">
                    <h2>⚠️ High Risk of Heart Disease</h2>
                    <p><strong>Confidence:</strong> ${(100 - result.probability).toFixed(2)}%</p>
                    <p>🏥 Please consult a healthcare professional.</p>
                </div>
            `;

        }

    }

    catch (error) {

        console.error(error);

        button.disabled = false;
        button.innerHTML = "❤️ Predict Heart Risk";

        resultBox.className = "result";

        resultBox.innerHTML = `
            <h2 style="color:red;">❌ Unable to connect to the server.</h2>
        `;

    }

}
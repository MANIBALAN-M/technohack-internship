let currentInput = "0"
let shouldResetDisplay = false
let lastResult = null

function updateDisplay() {
  const display = document.getElementById("display")
  const expression = document.getElementById("expression")

  display.value = currentInput
  expression.textContent = currentInput !== "0" ? currentInput : ""
}

function addToDisplay(value) {
  if (shouldResetDisplay) {
    currentInput = ""
    shouldResetDisplay = false
  }

  if (currentInput === "0" && value !== ".") {
    currentInput = value
  } else {
    currentInput += value
  }

  updateDisplay()
}

function addFunction(func) {
  if (shouldResetDisplay) {
    currentInput = ""
    shouldResetDisplay = false
  }

  if (currentInput === "0") {
    currentInput = func
  } else {
    currentInput += func
  }

  updateDisplay()
}

function clearAll() {
  currentInput = "0"
  shouldResetDisplay = false
  updateDisplay()
}

function backspace() {
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1)
  } else {
    currentInput = "0"
  }
  updateDisplay()
}

function toggleSign() {
  if (currentInput !== "0") {
    if (currentInput.startsWith("-")) {
      currentInput = currentInput.substring(1)
    } else {
      currentInput = "-" + currentInput
    }
    updateDisplay()
  }
}

async function calculate() {
  try {
    const response = await fetch("/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expression: currentInput,
        operation: "evaluate",
      }),
    })

    const data = await response.json()

    if (data.result === "Error") {
      document.getElementById("display").classList.add("error")
      setTimeout(() => {
        document.getElementById("display").classList.remove("error")
      }, 1000)
    }

    currentInput = data.result
    shouldResetDisplay = true
    lastResult = data.result
    updateDisplay()
  } catch (error) {
    currentInput = "Error"
    shouldResetDisplay = true
    updateDisplay()
  }
}

async function factorial() {
  try {
    const response = await fetch("/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expression: currentInput,
        operation: "factorial",
      }),
    })

    const data = await response.json()
    currentInput = data.result
    shouldResetDisplay = true
    updateDisplay()
  } catch (error) {
    currentInput = "Error"
    shouldResetDisplay = true
    updateDisplay()
  }
}

async function memoryStore() {
  try {
    await fetch("/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expression: currentInput,
        operation: "memory_store",
      }),
    })

    const btn = event.target
    const originalBg = btn.style.background
    btn.style.background = "#2ecc71"
    setTimeout(() => {
      btn.style.background = originalBg
    }, 200)
  } catch (error) {
    console.error("Memory store error:", error)
  }
}

async function memoryRecall() {
  try {
    const response = await fetch("/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation: "memory_recall",
      }),
    })

    const data = await response.json()
    currentInput = data.result
    shouldResetDisplay = true
    updateDisplay()
  } catch (error) {
    console.error("Memory recall error:", error)
  }
}

async function memoryClear() {
  try {
    await fetch("/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation: "memory_clear",
      }),
    })

    const btn = event.target
    const originalBg = btn.style.background
    btn.style.background = "#e74c3c"
    setTimeout(() => {
      btn.style.background = originalBg
    }, 200)
  } catch (error) {
    console.error("Memory clear error:", error)
  }
}

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key

  if ((key >= "0" && key <= "9") || key === ".") {
    addToDisplay(key)
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    addToDisplay(key)
  } else if (key === "Enter" || key === "=") {
    event.preventDefault()
    calculate()
  } else if (key === "Escape" || key === "c" || key === "C") {
    clearAll()
  } else if (key === "Backspace") {
    backspace()
  } else if (key === "(" || key === ")") {
    addToDisplay(key)
  }
})

updateDisplay()

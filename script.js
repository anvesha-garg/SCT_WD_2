document.addEventListener("DOMContentLoaded", function () {
    // Create stars
    const starsContainer = document.querySelector('.stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random positions
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random sizes
        const size = Math.random() * 3;
        
        // Random animation delay
        const delay = Math.random() * 5;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${delay}s`;
        
        starsContainer.appendChild(star);
    }

    const display = document.getElementById("display");
    const buttons = document.querySelectorAll(".btn");
    const calculator = document.querySelector(".calculator");

    let currentInput = "";
    let lastOperation = false;
    let lastResult = null; // Store the last calculated result
    const PI = Math.PI;

    // Function to update display
    function updateDisplay() {
        display.value = currentInput;
        
        // Add magical glow effect if there's a result
        if (!lastOperation && currentInput.length > 0) {
            display.style.boxShadow = "0 0 15px #8a4fff, 0 0 5px #fff inset";
        } else {
            display.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3) inset";
        }
    }

    // Function to add magical ripple effect (reduced size and opacity)
    function createRippleEffect(x, y) {
        const effect = document.createElement('div');
        effect.classList.add('magical-effect');
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        
        calculator.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 400); // Reduced duration
    }

    // Function to calculate scientific operations
    function calculateScientific(input, operation) {
        let result;
        try {
            const currentValue = eval(input);
            
            switch(operation) {
                case 'sin':
                    result = Math.sin(currentValue);
                    break;
                case 'cos':
                    result = Math.cos(currentValue);
                    break;
                case 'tan':
                    result = Math.tan(currentValue);
                    break;
                case '√':
                    result = Math.sqrt(currentValue);
                    break;
                case 'x²':
                    result = Math.pow(currentValue, 2);
                    break;
                case 'log':
                    result = Math.log10(currentValue);
                    break;
                default:
                    return input;
            }
            
            // Limit decimal places
            if (String(result).includes('.') && String(result).split('.')[1].length > 8) {
                result = parseFloat(result).toFixed(8);
            }
            
            lastResult = result; // Store the result
            return result.toString();
        } catch (error) {
            return "Spell Failed";
        }
    }

    // Function to handle button click events
    function handleButtonClick(value, x, y) {
        // Only create ripple effect for specific operations (reduced frequency)
        if (value === "=" || value === "C" || ['sin', 'cos', 'tan', '√', 'x²', 'log'].includes(value)) {
            createRippleEffect(x, y);
        }
        
        // Scientific functions
        if (['sin', 'cos', 'tan', '√', 'x²', 'log'].includes(value)) {
            if (currentInput) {
                currentInput = calculateScientific(currentInput, value);
                lastOperation = false;
            } else {
                currentInput = "Spell Failed";
                calculator.style.boxShadow = "0 0 30px #e53e3e, 0 0 15px rgba(255, 255, 255, 0.5) inset";
                
                setTimeout(() => {
                    calculator.style.boxShadow = "0 0 30px #8a4fff, 0 0 15px rgba(255, 255, 255, 0.5) inset";
                }, 1000);
            }
        }
        // Pi constant
        else if (value === 'π') {
            currentInput += PI.toString();
            lastOperation = false;
        }
        // Power operator
        else if (value === '^') {
            currentInput += '**';
            lastOperation = true;
        }
        // Equals operation
        else if (value === "=") {
            try {
                // Replace any remaining scientific notations or special characters
                let evalInput = currentInput.replace(/\^/g, '**');
                
                let result = eval(evalInput).toString();
                
                // Limit decimal places
                if (result.includes('.') && result.split('.')[1].length > 8) {
                    result = parseFloat(result).toFixed(8);
                }
                
                // Store the expression and the result
                const expression = currentInput;
                currentInput = result;
                lastResult = result;
                lastOperation = false;
            } catch (error) {
                currentInput = "Spell Failed";
                calculator.style.boxShadow = "0 0 30px #e53e3e, 0 0 15px rgba(255, 255, 255, 0.5) inset";
                
                setTimeout(() => {
                    calculator.style.boxShadow = "0 0 30px #8a4fff, 0 0 15px rgba(255, 255, 255, 0.5) inset";
                }, 1000);
            }
        } 
        // Clear operation
        else if (value === "C") {
            currentInput = "";
            lastOperation = true;
            lastResult = null;
        } 
        // Delete operation
        else if (value === "⌫") {
            currentInput = currentInput.slice(0, -1);
            lastOperation = true;
        } 
        // All other operations (numbers, operators, brackets)
        else {
            // If we've just calculated a result and press a number, start a new calculation
            if (!isNaN(value) && lastResult !== null && currentInput === lastResult.toString()) {
                currentInput = value;
                lastResult = null;
            }
            // If we've just calculated a result and press an operator, continue with that result
            else if ("+-*/()".includes(value) && lastResult !== null) {
                currentInput += value;
            }
            // Otherwise just append to the current input
            else {
                currentInput += value;
            }
            
            if ("+-*/()".includes(value)) {
                lastOperation = true;
            } else {
                lastOperation = false;
            }
        }
        updateDisplay();
    }

    // Add event listeners to all buttons
    buttons.forEach((button) => {
        button.addEventListener("click", function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            handleButtonClick(this.innerText, e.clientX, e.clientY);
            
            // Add subtle floating animation on click
            this.style.animation = "none";
            this.offsetHeight; // Trigger reflow
            this.style.animation = "";
        });
    });

    // Handle keyboard input
    document.addEventListener("keydown", function (event) {
        const key = event.key;
        const calculatorCenter = {
            x: calculator.offsetWidth / 2,
            y: calculator.offsetHeight / 2
        };
        
        if (!isNaN(key) || "+-*/.()^".includes(key)) {
            // Only create ripple for operators, not for every keypress
            if ("+-*/^".includes(key)) {
                createRippleEffect(calculatorCenter.x, calculatorCenter.y);
            }
            
            // If we've just calculated a result and press a number, start a new calculation
            if (!isNaN(key) && lastResult !== null && currentInput === lastResult.toString()) {
                currentInput = key;
                lastResult = null;
            }
            // If we've just calculated a result and press an operator, continue with that result
            else if ("+-*/()^".includes(key) && lastResult !== null) {
                if (key === '^') {
                    currentInput += '**';
                } else {
                    currentInput += key;
                }
            }
            // Otherwise just append to the current input
            else {
                if (key === '^') {
                    currentInput += '**';
                } else {
                    currentInput += key;
                }
            }
            
            if ("+-*/()^".includes(key)) {
                lastOperation = true;
            } else {
                lastOperation = false;
            }
        } else if (key === "Enter") {
            try {
                // Create ripple effect for Enter key
                createRippleEffect(calculatorCenter.x, calculatorCenter.y);
                
                // Replace any remaining scientific notations or special characters
                let evalInput = currentInput.replace(/\^/g, '**');
                let result = eval(evalInput).toString();
                
                // Limit decimal places
                if (result.includes('.') && result.split('.')[1].length > 8) {
                    result = parseFloat(result).toFixed(8);
                }
                
                // Store the expression and the result
                const expression = currentInput;
                currentInput = result;
                lastResult = result;
                lastOperation = false;
            } catch (error) {
                currentInput = "Spell Failed";
                calculator.style.boxShadow = "0 0 30px #e53e3e, 0 0 15px rgba(255, 255, 255, 0.5) inset";
                
                setTimeout(() => {
                    calculator.style.boxShadow = "0 0 30px #8a4fff, 0 0 15px rgba(255, 255, 255, 0.5) inset";
                }, 1000);
            }
        } else if (key === "Backspace") {
            currentInput = currentInput.slice(0, -1);
            lastOperation = true;
        } else if (key === "Escape") {
            currentInput = "";
            lastOperation = true;
            lastResult = null;
        }

        updateDisplay();
    });

    // Initialize display
    updateDisplay();
});
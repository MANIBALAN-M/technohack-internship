from flask import Flask, render_template, request, jsonify
import math
import re

app = Flask(__name__)

class ScientificCalculator:
    def __init__(self):
        self.memory = 0
        
    def evaluate_expression(self, expression):
        try:
            expression = expression.replace('π', str(math.pi))
            expression = expression.replace('e', str(math.e))
            
            expression = self.replace_functions(expression)
            
            result = eval(expression)
            return str(result)
        except Exception as e:
            return "Error"
    
    def replace_functions(self, expression):
        functions = {
            'sin': 'math.sin',
            'cos': 'math.cos',
            'tan': 'math.tan',
            'asin': 'math.asin',
            'acos': 'math.acos',
            'atan': 'math.atan',
            'sinh': 'math.sinh',
            'cosh': 'math.cosh',
            'tanh': 'math.tanh',
            'log': 'math.log10',
            'ln': 'math.log',
            'sqrt': 'math.sqrt',
            'exp': 'math.exp',
            'abs': 'abs',
            'ceil': 'math.ceil',
            'floor': 'math.floor'
        }
        
        for func, replacement in functions.items():
            pattern = f'{func}\\('
            expression = re.sub(pattern, f'{replacement}(', expression)
        
        return expression
    
    def factorial(self, n):
        try:
            n = int(float(n))
            if n < 0:
                return "Error"
            return str(math.factorial(n))
        except:
            return "Error"
    
    def power(self, base, exponent):
        try:
            return str(pow(float(base), float(exponent)))
        except:
            return "Error"
    
    def percentage(self, value):
        try:
            return str(float(value) / 100)
        except:
            return "Error"

calculator = ScientificCalculator()

@app.route('/')
def index():
    return render_template('calculator.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    expression = data.get('expression', '')
    operation = data.get('operation', 'evaluate')
    
    if operation == 'evaluate':
        result = calculator.evaluate_expression(expression)
    elif operation == 'factorial':
        result = calculator.factorial(expression)
    elif operation == 'power':
        base = data.get('base', '0')
        exponent = data.get('exponent', '0')
        result = calculator.power(base, exponent)
    elif operation == 'percentage':
        result = calculator.percentage(expression)
    elif operation == 'memory_store':
        calculator.memory = float(expression) if expression else 0
        result = expression
    elif operation == 'memory_recall':
        result = str(calculator.memory)
    elif operation == 'memory_clear':
        calculator.memory = 0
        result = '0'
    else:
        result = "Error"
    
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)

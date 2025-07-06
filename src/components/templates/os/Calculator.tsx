"use client";

import React, { useState } from 'react';

const Button = ({ onClick, children, className = '' }: { onClick: () => void; children: React.ReactNode; className?: string }) => (
  <button onClick={onClick} className={`bg-win-gray border-2 border-outset active:border-inset p-1 focus:outline-none focus:ring-1 focus:ring-black ${className}`}>
    {children}
  </button>
);

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
        setDisplay('.');
        setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (currentValue === null) {
      setCurrentValue(inputValue);
    } else if (operator) {
      const result = calculate(currentValue, inputValue, operator);
      setCurrentValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };
  
  const calculate = (firstOperand: number, secondOperand: number, op: string) => {
    switch (op) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '*': return firstOperand * secondOperand;
      case '/': return firstOperand / secondOperand;
      case '=': return secondOperand;
      default: return secondOperand;
    }
  };

  return (
    <div className="bg-win-gray p-2 space-y-2 select-none">
      <div className="bg-white text-right p-1 border-2 border-inset text-lg h-8">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Button onClick={() => performOperation('/')}>/</Button>
        <Button onClick={() => performOperation('*')}>*</Button>
        <Button onClick={() => performOperation('-')}>-</Button>
        <Button onClick={() => performOperation('+')}>+</Button>
        
        <Button onClick={() => inputDigit('7')}>7</Button>
        <Button onClick={() => inputDigit('8')}>8</Button>
        <Button onClick={() => inputDigit('9')}>9</Button>
        <Button onClick={() => performOperation('=')} className="row-span-2">=</Button>

        <Button onClick={() => inputDigit('4')}>4</Button>
        <Button onClick={() => inputDigit('5')}>5</Button>
        <Button onClick={() => inputDigit('6')}>6</Button>
        
        <Button onClick={() => inputDigit('1')}>1</Button>
        <Button onClick={() => inputDigit('2')}>2</Button>
        <Button onClick={() => inputDigit('3')}>3</Button>
        <Button onClick={() => clear()} className="row-span-2">C</Button>

        <Button onClick={() => inputDigit('0')} className="col-span-2">0</Button>
        <Button onClick={inputDecimal}>.</Button>
      </div>
    </div>
  );
}

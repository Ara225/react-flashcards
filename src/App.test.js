import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('Render main page', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Add Flashcards/i);
  expect(linkElement).toBeInTheDocument();
});

test('Render popup with no flashcards', () => {
  const { getByText } = render(<App />);
  document.getElementById("popupButton").click()
  const linkElement = getByText(/Error: No Flashcards added yet/i);
  expect(linkElement).toBeInTheDocument();
});

test('Render popup with flashcard and flip flashcard', () => {
  const { getByText } = render(<App />);
  // Submit form
  document.getElementById("new-flashcard-front").value = "front of flashcard"
  document.getElementById("new-flashcard-back").value = "back of flashcard"
  document.getElementById("submitButton").click()
  // Open popup
  document.getElementById("popupButton").click()
  // Confirm display of front of flashcard
  var linkElement = getByText(/front of flashcard/i);
  expect(linkElement).toBeInTheDocument();
  // Confirm display of back of flashcard after flip
  document.getElementById("flashcardStatusSection").click()
  linkElement = getByText(/back of flashcard/i);
  expect(linkElement).toBeInTheDocument();
});

test('Render popup and navigate to next flashcard', () => {
  const { getByText } = render(<App />);
  // Submit two flashcards
  document.getElementById("new-flashcard-front").value = "front of flashcard"
  document.getElementById("new-flashcard-back").value = "back of flashcard"
  document.getElementById("submitButton").click()
  document.getElementById("new-flashcard-front").value = "front of flashcard 2"
  document.getElementById("new-flashcard-back").value = "back of flashcard 2"
  document.getElementById("submitButton").click()
  // Open popup
  document.getElementById("popupButton").click()
  // Go to next flashcard
  document.getElementById("getNext").click()
  var linkElement = getByText(/front of flashcard 2/i);
  expect(linkElement).toBeInTheDocument();
  document.getElementById("flashcardStatusSection").click()
  linkElement = getByText(/back of flashcard 2/i);
  expect(linkElement).toBeInTheDocument();
});

test('Render popup and successfully mark as learnt', () => {
  const { getByText } = render(<App />);
  document.getElementById("new-flashcard-front").value = "front of flashcard"
  document.getElementById("new-flashcard-back").value = "back of flashcard"
  document.getElementById("submitButton").click()
  document.getElementById("new-flashcard-front").value = "front of flashcard 2"
  document.getElementById("new-flashcard-back").value = "back of flashcard 2"
  document.getElementById("submitButton").click()
  document.getElementById("popupButton").click()
  document.getElementById("learnt").click()
  var linkElement = getByText(/front of flashcard 2/i);
  expect(linkElement).toBeInTheDocument();
  document.getElementById("flashcardStatusSection").click()
  linkElement = getByText(/back of flashcard 2/i);
  expect(linkElement).toBeInTheDocument();
  linkElement = getByText(/Learnt: 1/i);
  expect(linkElement).toBeInTheDocument();
});


test('Render popup and navigate backwards and forwards', () => {
  const { getByText } = render(<App />);
  document.getElementById("new-flashcard-front").value = "front of flashcard"
  document.getElementById("new-flashcard-back").value = "back of flashcard"
  document.getElementById("submitButton").click()
  document.getElementById("new-flashcard-front").value = "front of flashcard 2"
  document.getElementById("new-flashcard-back").value = "back of flashcard 2"
  document.getElementById("submitButton").click()
  document.getElementById("popupButton").click()
  document.getElementById("getNext").click()
  // Confirm that we're on the second card
  var linkElement = getByText(/front of flashcard 2/i);
  expect(linkElement).toBeInTheDocument();
  document.getElementById("flashcardStatusSection").click()
  linkElement = getByText(/back of flashcard 2/i);
  expect(linkElement).toBeInTheDocument();
  // Move to the first flashcard
  document.getElementById("getPrevious").click()
  // Confirm that we're on the first card
  linkElement = getByText(/front of flashcard/i);
  expect(linkElement).toBeInTheDocument();
  document.getElementById("flashcardStatusSection").click()
  linkElement = getByText(/back of flashcard/i);
  expect(linkElement).toBeInTheDocument();
});
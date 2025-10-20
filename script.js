"use strict";
const author = document.querySelector(".quote-author");
const quoteContent = document.querySelector(".quote-content");
const tagsContainer = document.querySelector(".quote-tags-container");

const btnRandomQuote = document.querySelector(".new-quote");
const shareText = document.querySelector(".share-text");
const btnShareQuote = document.querySelector(".share-quote");

let quotesData = [];
let lastIndex = -1;

const API_URL = "https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/3-javascript/challenges/group_1/data/random-quotes.json";

// Get quotes
async function getQuotes() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Response status: ${res.status}`);
        const result = await res.json();
        return result;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// display quotes
function showRandomQuote() {
    if (!quotesData.length) return;

    let index;
    do {
        index = Math.floor(Math.random() * quotesData.length);
    } while (index === lastIndex && quotesData.length > 1);

    lastIndex = index;
    const randomQuote = quotesData[index];
    author.textContent = randomQuote.author;
    quoteContent.textContent = randomQuote.quote;
    tagsContainer.innerHTML = "";

    // Add new tags if available
    if (randomQuote.tags && randomQuote.tags.length) {
        randomQuote.tags.forEach(tag => {
            const span = document.createElement("span");
            span.className = "quote-tags";
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
    }
}

// Copy author and quote to clipboard
async function copyToClipBoard() {
    const authorText = author.textContent.trim();
    const quoteText = quoteContent.textContent.trim();
    const textToCopy = `${authorText} - ${quoteText}`;
    shareText.textContent = "Copied!";
    btnShareQuote.disabled = true;
    try {
        await navigator.clipboard.writeText(textToCopy);
        setTimeout(() => {
            shareText.textContent = `Share`;
            btnShareQuote.disabled = false;
        }, 2000);
    } catch (err) {
        console.error("Failed to copy text:", err);
        shareText.textContent = "Error!";
        setTimeout(() => {
            shareText.textContent = "Share";
        }, 2000);
    }
}

// Initialize: fetch quotes and show default quote on page load
async function init() {
    quotesData = await getQuotes();
    if (quotesData && quotesData.length) {
        showRandomQuote();
    } else {
        author.textContent = "Unknown";
        quoteContent.textContent = "Keep moving forward.";
    }
}

btnRandomQuote.addEventListener("click", showRandomQuote);
btnShareQuote.addEventListener("click", copyToClipBoard);


init();
// utils/errorHandler.js

/**
 * Safely parses JSON from Claude's response with fallback to raw text.
 * Removes markdown code blocks.
 * @param {string} text - The text to parse.
 * @returns {object|string} Parsed JSON or raw text.
 */
function parseApiResponse(text) {
    try {
        const json = JSON.parse(text);
        return json;
    } catch (e) {
        return text.replace(/```(.*?)```/gs, ''); // remove markdown code blocks
    }
}

/**
 * Converts technical errors to user-friendly messages based on error type and context.
 * @param {Error} error - The error to format.
 * @param {string} context - The context in which the error occurred.
 * @returns {string} Formatted error message.
 */
function formatErrorMessage(error, context) {
    if (error instanceof SyntaxError) {
        return `Syntax Error: ${error.message} in ${context}`;
    } else if (error instanceof TypeError) {
        return `Type Error: ${error.message} in ${context}`;
    } else {
        return `Error: ${error.message} occurred in ${context}`;
    }
}

/**
 * Logs session analytics including errors, turn counts, reasoning progression to console.
 * Could be extended to send to analytics service.
 * @param {string} event - The event to log.
 * @param {object} data - The data related to the event.
 */
function logAnalytics(event, data) {
    console.log(`Event: ${event}`, data);
    // extend to external analytics service as needed
}

/**
 * Validates that API response contains required fields.
 * @param {object} data - The API response data.
 * @throws Will throw an error if validation fails.
 */
function validateApiResponse(data) {
    const requiredFields = ['reply', 'reasoning_quality', 'phase_hint'];
    requiredFields.forEach(field => {
        if (!data.hasOwnProperty(field)) {
            throw new Error(`Missing field: ${field}`);
        }
    });
}

/**
 * Extracts error information from Anthropic API responses.
 * @param {object} response - The response from the API.
 * @returns {object} Error information extracted from the response.
 */
function getErrorDetails(response) {
    return response.error ? {
        message: response.error.message,
        code: response.error.code,
    } : null;
}

module.exports = { parseApiResponse, formatErrorMessage, logAnalytics, validateApiResponse, getErrorDetails };
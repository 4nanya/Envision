import React, {useState} from 'react';
import axios from 'axios';
import * as Speech from 'expo-speech';


function openai(promptValues) {
    console.log("Entering OpenAI Function");

  const apiKey = "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";

  const myPrompt = "Can you describe setting with these words: " + promptValues.toString();

  const client = axios.create({
    headers: {
      Authorization: "Bearer " + apiKey,
    },
  });


  const params = {
    prompt: myPrompt,
    model: "text-davinci-003",
    max_tokens: 100,
    temperature: 0,
  };

  client
    .post("https://api.openai.com/v1/completions", params)
    .then((result) => {
      console.log("openai result in function" + result.data.choices[0].text);
      Speech.speak(result.data.choices[0].text);
      return (result.data.choices[0].text);
    })
    .catch((err) => {
      console.log(err);
    });
  };
export default openai;
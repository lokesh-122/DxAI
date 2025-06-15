<h1>🧠 DxAI – Decode Your Diagnosis</h1>
<blockquote><em>Making health reports understandable, actionable, and accessible with AI.</em></blockquote>

<hr />

<h2>💡 The Problem It Solves</h2>
<p>
Reading and understanding medical reports is a daunting task for the average person. These reports are packed with clinical jargon, complex acronyms, and unfamiliar numerical values. For most patients, especially those without a medical background, this creates confusion, anxiety, and delays in decision-making.
</p>

<p><strong>People often ask:</strong></p>
<ul>
  <li>“What does this result mean?”</li>
  <li>“Is my condition serious?”</li>
  <li>“What should I eat or avoid?”</li>
  <li>“Which doctor should I consult?”</li>
  <li>“Where is the nearest specialist hospital?”</li>
</ul>

<p><strong>Unfortunately, the answers are often scattered, unclear, or buried in long Google searches. This leads to:</strong></p>
<ul>
  <li>⏱️ Delayed treatment</li>
  <li>❌ Misinformation</li>
  <li>😟 Increased anxiety</li>
  <li>🏥 Unnecessary hospital visits</li>
  <li>🔁 Lack of continuity in care</li>
</ul>

<hr />

<h2>🧬 How DxAI Solves This Problem</h2>
<p>DxAI is an AI-powered platform that transforms medical reports into easy-to-understand health summaries and recommendations. Users can simply upload a PDF (e.g., lipid profile, CBC, liver/kidney function test), and the platform will:</p>
<ul>
  <li>🔍 <strong>Extract and highlight key values</strong> using OCR and NLP</li>
  <li>📃 <strong>Summarize the diagnosis and condition</strong> (e.g., “Fatty Liver Grade II”)</li>
  <li>📊 <strong>Classify the condition's severity</strong> (mild / moderate / severe)</li>
  <li>🥗 <strong>Recommend food & lifestyle habits</strong> based on the diagnosis</li>
  <li>🏥 <strong>Suggest relevant medical specialists</strong> (e.g., gastroenterologist)</li>
  <li>📍 <strong>Locate nearby hospitals or clinics</strong> using Google Maps API</li>
</ul>

<hr />

<h2>🔒 Why This Matters</h2>
<ul>
  <li>✅ Makes healthcare understandable to non-experts</li>
  <li>⏳ Saves time by offering instant guidance</li>
  <li>💬 Builds patient confidence and informed decision-making</li>
  <li>🌍 Especially useful in rural and underserved areas</li>
  <li>🔁 Simplifies continuity of care with easy report sharing</li>
</ul>

<hr />

<h2>⚙️ Technologies Used</h2>
<ul>
  <li><strong>Frontend:</strong> React, Next.js, Tailwind CSS, TypeScript</li>
  <li><strong>Backend:</strong> Firebase (Auth, Firestore, Functions), REST APIs</li>
  <li><strong>OCR & NLP:</strong> Tesseract.js, spaCy, Regex Parsing</li>
  <li><strong>Maps & Geolocation:</strong> Google Maps API, Geofencing API</li>
  <li><strong>AI/ML:</strong> LLM for medical summarization, rule-based fallback system</li>
</ul>

<hr />

<h2>🚧 Challenges We Ran Into</h2>

<h4>1. 🧾 Parsing Inconsistent Medical Reports</h4>
<p><em>Reports varied in format (scanned vs digital), making data extraction hard.</em></p>
<p><strong>Solution:</strong></p>
<ul>
  <li>Used Tesseract for OCR</li>
  <li>Built a PDF.js + Regex parsing engine</li>
  <li>Created medical dictionaries and custom spaCy NER pipelines</li>
</ul>

<h4>2. 🌐 Google Maps API Restrictions</h4>
<p><em>Faced ApiTargetBlockedMapError due to improper key configurations.</em></p>
<p><strong>Solution:</strong></p>
<ul>
  <li>Properly set referrer restrictions</li>
  <li>Enabled all required services in the API console</li>
</ul>

<h4>3. ⚡ AI Response Time Issues</h4>
<p><em>LLMs introduced latency that hurt user experience.</em></p>
<p><strong>Solution:</strong></p>
<ul>
  <li>Added shimmer loading UIs and progress bars</li>
  <li>Cached summaries in Firestore for repeat access</li>
  <li>Used rule-based summaries for common conditions</li>
</ul>

<h4>4. 🔐 Secure Messaging Integration</h4>
<p><em>Email and WhatsApp APIs required secure handling and templating.</em></p>
<p><strong>Solution:</strong></p>
<ul>
  <li>Used Firebase Functions with encrypted configs</li>
  <li>Designed standardized messaging templates</li>
</ul>

<h2>🚀 Future Roadmap</h2>
<ul>
  <li>📱 Launch Android/iOS app</li>
  <li>🌐 Add multilingual support (Hindi, Telugu, Tamil, etc.)</li>
  <li>🤝 Connect users directly to verified doctors</li>
  <li>🔄 Integration with HealthVault / DigiLocker APIs</li>
  <li>💡 Provide real-time teleconsultation suggestions</li>
</ul>

<hr />

<h2>🏆 Hackathon Tracks</h2>
<ul>
  <li>🔓 Open Innovation</li>
  <li>💻 Best Use of GitHub</li>
</ul>

<hr />

<h2>🧑‍💻 Contributors</h2>
<ul>
  <li><strong>Jampana Lokesh Varma</strong> – AI/ML, OCR/NLP, Firebase Functions</li>
  <!-- Add more contributors if needed -->
</ul>

<hr />

<h2>🔗 Demo Links</h2>
<ul>
  <li><strong>Live Site:</strong> <a href="https://dx-ai-lokeshs-projects-d5ed2be8.vercel.app/">dx-ai-lokeshs-projects.vercel.app</a></li>
  <li><strong>GitHub Repo:</strong> <a href="https://github.com/your-username/dxai">github.com/your-username/dxai</a></li>
</ul>

<hr />

<hr />

<h2>🙌 Acknowledgements</h2>
<ul>
  <li>Google Maps & Places API</li>
  <li>Firebase Team</li>
  <li>spaCy & HuggingFace</li>
  <li>Hackathon mentors and reviewers 💙</li>
</ul>


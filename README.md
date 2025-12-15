# Anki Helper

Anki Helper is a utility designed to streamline the process of studying the Japanese language, specifically for kanji memorization. When I needed to memorize around 50 new kanji daily from a reference book, the task of manually querying each kanji's meaning from [Jisho](https://jisho.org/) and importing the data into Anki was incredibly time-consuming. To solve this problem, I developed this tool to automate the process and improve my workflow.

Luckily, I found [Anki Connect](https://git.sr.ht/~foosoft/anki-connect), a plugin that allows programmatic interaction with Anki, making this automation possible.

![Screenshot](https://github.com/user-attachments/assets/f18d406a-1ab3-4d25-9296-cf1f99c229c1)

## Requirements

To use Anki Helper, follow these setup steps:

1. **Install Anki Connect Plugin**

   * Follow the instructions on the [Anki Connect page](https://ankiweb.net/shared/info/2055492159) to install the plugin.
   * Ensure that Anki is open and running while the web page is active.

2. **Configure Anki Connect**

   * In Anki, go to `Tools` -> `Add-ons`, and double-click **Anki Connect** to open its settings.
   * Add the web page's URL to the `webCorsOriginList`. Depending on whether you're running the page locally or on a public server, the URL might be `localhost` or the appropriate public URL.

3. **Set Anki Host/Port**

   * While in the Anki Connect settings, check the **Host** and **Port** values for Anki, and make sure to enter these into the web page settings to establish proper communication.

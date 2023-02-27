# QuickDraw with Pts

This is a script to render a series of drawings from the [QuickDraw dataset](https://github.com/googlecreativelab/quickdraw-dataset)

![angel gif](https://user-images.githubusercontent.com/4358746/221458018-6f759c9b-c22c-4477-86ca-e6558db65610.gif)

### Online demo

See [https://williamngan.github.io/pts-lab/quickdraw/](https://williamngan.github.io/pts-lab/quickdraw/)

### Add your own data

1. Download a `ndjson` file from the dataset and then create a subset. [See instruction here](https://github.com/googlecreativelab/quickdraw-dataset/blob/master/examples/nodejs/ndjson.md) on how to save it as `json` file. I suggest trying a smaller subset with 5 or 10 drawings first. Here's an example to get the first 10 drawings using `ndjson-cli`

```bash
cat bear.ndjson | ndjson-filter 'd.recognized == true' | head -n 10 | ndjson-reduce > bear.json
```

2. Change the json file name in index.js

3. Run `npx serve .` or `python -m http.server` to view the demo in localhost.

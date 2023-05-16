async function addGeneLabel(gene, labels, setLabels, setLabelButton)
{
  await fetch(SITE_DEFAULTS.API_PATH+"services/genespans/"+gene).then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error("Bad response from "+SITE_DEFAULTS.API_PATH+"/services/genespans")
    }
    return res
  }).then(res => res.json()).then(data=>{
      var l = labels;
      setLabelButton(true)
      if (l === "") {
        l += data['response']['results'][0]['referenceName'] + ":" + data['response']['results'][0]['start']
        +  "-" + data['response']['results'][0]['end'] + ":" + gene;
      } else {
        l += "," + data['response']['results'][0]['referenceName'] + ":" + data['response']['results'][0]['start']
        +  "-" + data['response']['results'][0]['end'] + ":" + gene;
      }
      window.scrollTo(0, 0);
      setLabels(l);
  }).catch((error) => {
      console.log(error)
    })
}

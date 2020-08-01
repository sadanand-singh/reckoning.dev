---
title: 'Interactive Data Visualization in Python Using Bokeh'
date: 2018-05-04
tags:
  - 'Guides'
  - 'MachineLearning'
slug: 'interactive-data-visuals'
---

There are two types of data visualizations: _exploratory_ and _explanatory_. Explanatory analysis
is what happens when you have something specific you want to show an audience. The aim of
**explanatory** visualizations is to tell stories - they’re carefully constructed to surface key
findings.

{% callout "action" %}
**Please note that the interactive plots here do not load, as it requires loading a really large data and javascript file!**
{% endcallout %}

Exploratory analysis, on the other hand, is what you do to get familiar with the data. You may
start out with a hypothesis or question, or you may just really be delving into the data to
determine what might be interesting about it. **Exploratory** visualizations, "create an interface
into a dataset or subject matter... they facilitate the user exploring the data, letting them
unearth their own insights: findings they consider relevant or interesting."

In a previous series of posts on [exploratory data analysis (EDA)][eda] - [EDA 1][eda1], [EDA
2][eda2], [EDA 3][eda3] and [EDA 4][eda4], we have covered static plotting in python using major
libraries like [matplotlib], [seaborn], [plotnine], and [pandas]. `plotnine` is an implementation
of a grammar of graphics in Python, based on the [ggplot2] library in R. The grammar allows users
to compose plots by explicitly mapping data to the visual objects that make up the plot.

[eda]: https://en.wikipedia.org/wiki/Exploratory_data_analysis
[eda1]: /intro-pandas
[eda2]: /onevariableeda
[eda3]: /python-plots-two-vars
[eda4]: /python-plots-multi-vars
[matplotlib]: https://matplotlib.org/
[pandas]: https://pandas.pydata.org/
[seaborn]: https://seaborn.pydata.org/
[plotnine]: https://plotnine.readthedocs.io/en/stable/
[ggplot2]: https://ggplot2.org/

In this article, we will focus on EDA using interactive plots. More often than not, exploratory
visualizations are easier when they are interactive!

## Python Libraries

Although there are few libraries in python that can help us make interactive plots, I find [bokeh]
and [holoviews] to be the only ones that can cover most use cases. Others like [plotly] and [pygal]
seem to be too specific and [mpld3] is no longer being actively maintained.

[bokeh]: https://bokeh.pydata.org/en/latest/
[holoviews]: https://holoviews.org/
[plotly]: https://plot.ly/
[pygal]: https://pygal.org/en/stable/
[mpld3]: https://github.com/mpld3/mpld3

`bokeh` provides fundamental blocks for making interactive plots, following the grammar of
graphics. `holoviews` on the hand uses bokeh as back-end to provide high level APIs for making
plots. All of these interactive plots can be viewed in a browser and are aided by corresponding
bokeh javascript and css files.

### Embedding bokeh Plots in Web Pages

In order to incorporate bokeh figures in a web page, you will first need to include following `css`
and `js` files in your page:

```html
<!-- css -->
<link
  href="//cdnjs.cloudflare.com/ajax/libs/bokeh/1.0.1/bokeh.min.css"
  rel="stylesheet"
  type="text/css"
/>
<link
  href="//cdnjs.cloudflare.com/ajax/libs/bokeh/1.0.1/bokeh-widgets.min.css"
  rel="stylesheet"
  type="text/css"
/>
<link
  href="//cdnjs.cloudflare.com/ajax/libs/bokeh/1.0.1/bokeh-tables.min.css"
  rel="stylesheet"
  type="text/css"
/>

<!-- java script -->
<script src="//cdnjs.cloudflare.com/ajax/libs/bokeh/1.0.1/bokeh.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/bokeh/1.0.1/bokeh-widgets.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/bokeh/1.0.1/bokeh-tables.min.js"></script>
```

The "-widgets" files are only necessary if your document includes bokeh widgets. Similarly, the
"-tables" files are only necessary if you are using Bokeh data tables in your document.

Then you can use the `bokeh.embed.components()` to generate relevant code for your plots. This
function returns a `<script>` that contains the data for your plot, together with an accompanying
`<div>` tag that the plot view is loaded into. These tags can be used in HTML documents however you
like:

```python
from bokeh.plotting import figure
from bokeh.embed import components

plot = figure()
plot.circle([1, 2], [3, 4])

script, div = components(plot)
```

The returned `<script>` will look something like:

```html
<script type="text/javascript">
      (function() {
    var fn = function() {
      Bokeh.safely(function() {
        var docs_json = { DOCUMENT DATA HERE };
        var render_items = [{
          "docid":"6833819f-9b5b-4904-821e-3f5eec77de9b",
          "elementid":"9574d123-9332-4b5f-96cc-6323bef37f40",
          "modelid":"7b328b27-9b14-4f7b-a5d8-0138bc7b0f59"
        }];

        Bokeh.embed.embed_items(docs_json, render_items);
      });
    };
    if (document.readyState != "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  })();
</script>
```

The resulting `<div>` will look something like:

```html
<div class="bk-root" id="9574d123-9332-4b5f-96cc-6323bef37f40"></div>
```

There will be one `<div>` for each of your plots and they should be placed at where you want your
plot to appear. The `<script>` section should be placed in a typical place - the bottom of the
`<body>` section for late loading.

## Examples

Bokeh has built-in support for various types of interactions (like pan, wheel zoom, box zoom, reset
and save etc.) on all plots. Additionally, all of such interactions can be customized.

In the following sections, we will look at few major types of interactions that are required
typically in an exploratory plot.

## Hover/ Tool-tips

Visualization of high dimensional data is a pretty common task in data science projects. The two
most common algorithms to project high dimensional data to 2-dimensional space are [TSNE][t-sne]
and [UMAP]. The [scikit-learn][sklearn] and [umap-learn] python libraries provide a neat
implementation of these algorithms.

In this post, as an example, we will use the [fashion MNIST][f-mnist] data to look at its TSNE and
UMAP embeddings. We can first load the data from the [pytorch] library. We will load only the
training data and save both images and labels in a [pandas] dataframe.

[t-sne]: https://lvdmaaten.github.io/tsne/
[umap]: https://arxiv.org/abs/1802.03426
[sklearn]: https://scikit-learn.org/stable/modules/generated/sklearn.manifold.TSNE.html
[umap-learn]: https://github.com/lmcinnes/umap
[f-mnist]: https://github.com/zalandoresearch/fashion-mnist
[pytorch]: https://pytorch.org/

```python
from torchvision.datasets import FashionMNIST
import numpy as np
import pandas as pd

fashion_mnist = FashionMNIST(root='./', download=True)

X, y = fashion_mnist.train_data.numpy(), fashion_mnist.train_labels.numpy()
X = X.astype('float32') / 255.
X = X.reshape((-1, np.prod(X.shape[1:])))

feat_cols = ['pixel'+str(i) for i in range(X.shape[1])]
df = pd.DataFrame(X, columns=feat_cols)
df['label'] = y
df['label'] = df['label'].apply(lambda i: str(i))
```

We will also create randomized permutation of indices so that we can access random elements of our
data.

```python
rndperm = np.random.permutation(df.shape[0])
```

Now, we can calculate the tsne and umap features. For faster computation, we will use only random
7000 samples.

```python
from sklearn.manifold import TSNE
import umap

n_sne = 7000
df_small = df.loc[rndperm[:n_sne], :].copy()

tsne = TSNE(n_components=2, verbose=1, perplexity=100, n_iter=1000)
tsne_results = tsne.fit_transform(df_small[feat_cols].values)

umap_obj = umap.UMAP(n_neighbors=5,
                      min_dist=0.1,
                      metric='correlation')
umap_results = umap_obj.fit_transform(df_small[feat_cols].values)
```

Now, we can use the resulting arrays `tsne_results` and `umap_results` to make bokeh plots. In
particular, we will use scatter plots to compare two embeddings. To make more sense of the data,it
would be great if hovering over a point could show the corresponding image. We will enable that
using a customized `HoverTool()` tool. The constructor for the `HoverTool` object takes a
`tooltips` option in the form of html code, that represents what is shown when one hovers over a
point. The data is provided in terms of arrays in the `ColumnDataSource`, by prefixing column names
with '@' symbol.

```python
from bokeh.plotting import figure, show, ColumnDataSource
from bokeh.layouts import gridplot
from bokeh.models import CDSView, Legend, GroupFilter, HoverTool, BoxZoomTool
from bokeh.models import LassoSelectTool, WheelZoomTool, BoxSelectTool, ResetTool

fm = {'0':'T-Shirt', '1':'Trouser', '2':'Pullover', '3':'Dress', '4':'Coat', '5':'Sandle', '6':'Shirt', '7':'Sneaker', '8':'Bag', '9':'Ankle Boot'}
hover = HoverTool( tooltips="""
    <div>
        @title
        <img src="@imgs" height="28" alt="@title" width="28"></img>
    </div>
    """
)

source = ColumnDataSource(data=dict(
    x1=umap_results[:, 0],
    y1=umap_results[:, 1],
    x2=tsne_results[:, 0],
    y2=tsne_results[:, 1],
    l=df_small.label,
    imgs=["images/interactive/"+i+'.png' for i in df_small.label],
    title=[fm[i] for i in df_small.label],
))
tools = [hover, BoxSelectTool(), LassoSelectTool(), WheelZoomTool(), BoxZoomTool(), ResetTool()]
clr = {'0':'darkred', '1':'darkgreen', '2':'goldenrod', '3':'blue', '4':'darkorange', '5':'darkslategray', '6':'hotpink', '7':'brown', '8':'black', '9':'dodgerblue'}
p1 = figure(plot_width=430, plot_height=300, title="UMAP", tools=tools)
legend_it = []
for c in clr:
    view0 = CDSView(source=source, filters=[GroupFilter(column_name='l', group=c)])
    circle = p1.circle(x='x1', y='y1', source=source, view=view0, color=clr[c], alpha=0.4)
    legend_it.append((fm[c], [circle]))

legend = Legend(items=legend_it, location=(20, 0))
legend.click_policy="mute"

p1.add_layout(legend, 'right')

p2 = figure(plot_width=300, plot_height=300, title="TSNE", tools=tools)
for c in clr:
    view0 = CDSView(source=source, filters=[GroupFilter(column_name='l', group=c)])
    circle = p2.circle(x='x2', y='y2', source=source, view=view0, color=clr[c], alpha=0.4)

p3 = gridplot([[p2, p1]])
show(p3)
```

Notice, how the two plots are linked - If you select some points in one, it will highlight the
corresponding points in other!

<div class="figure img-responsive" style="display:table; margin:0 auto;">
  <div class="bk-root">
    <div class="bk-plotdiv" id="70a9bff7-7337-40c4-8cdc-df05cca05bbc"></div>
  </div>
</div>
<br />

Also notice the trick used in the right plot of UMAP embeddings to move legends outside the plot
area. Commonly, `circle()` has an option for `legend`, however this leads to legend being shown
inside the main plot region!

## Linked Plots

Although we already have seen above how one can enable linked plots. In this example, I want to
highlight a different kind of linking. It’s often desired to link pan or zooming actions across
many plots. All that is needed to enable this feature is to share range objects between `figure()`
calls.

For this example, we will use the simpler [Boston Housing][bhousing] dataset. We can load this data
using the [scikit-learn library][sklearn] and save it in a pandas dataframe.

[bhousing]: https://www.cs.toronto.edu/~delve/data/boston/bostonDetail.html

```python
from sklearn.datasets import load_boston

x_train, y_train = load_boston(return_X_y=True)
df_boston = pd.DataFrame(x_train)
cols = ["CRIM", "ZN", "INDUS", "CHAS", "NOX"]
cols += ["RM", "AGE", "DIS", "RAD", "TAX", "PTRATIO", "B", "LRATIO"]
df_boston.columns = cols

df_boston['price'] = y_train
```

In particular, we want to look at the effect of average number of rooms per dwelling (RM), per
capita crime rate by town (CRIM) and pupil-teacher ratio ( PTRATIO) on the sales price of houses.
We can visualize such a correlation by scatter plots of each of these variables wrt price.

```python
tools ="pan,hover,box_select,lasso_select,wheel_zoom,box_zoom,reset"
source = ColumnDataSource(data=dict(
    x=df_boston.price,
    y1=df_boston.RM,
    y2=df_boston.CRIM,
    y3=df_boston.PTRATIO,
))

p4 = figure(plot_width=240, plot_height=240, title="RM vs Price", tools=tools)
p4.circle(x='x', y='y1', source=source, alpha=0.4, color='darkred')
p5 = figure(plot_width=240, plot_height=240, title="CRIM vs Price", tools=tools, x_range=p4.x_range)
p5.circle(x='x', y='y2', source=source, alpha=0.4, color='darkgreen')
p6 = figure(plot_width=240, plot_height=240, title="PTRATIO vs Price", tools=tools, x_range=p4.x_range)
p6.circle(x='x', y='y3', source=source, alpha=0.4, color='darkblue')
p44 = gridplot([[p4, p5, p6]])
p4.xaxis.axis_label = "Price (in thousands)"
p5.xaxis.axis_label = "Price (in thousands)"
p6.xaxis.axis_label = "Price (in thousands)"
show(p44)
```

In the following plot, with "pan" tool selected (the first one that looks like a +-like anchor
symbol), if you drag any one of the plots along x-axis all of others will move too! This is enabled
by letting `x_range` be shared to all plots. Notice, similar to the previous plot, we can still do
selection across all three plots since all plots share a common `ColumnDataSource`.

<div class="figure img-responsive" style="display:table; margin:0 auto;">
  <div class="bk-root">
    <div class="bk-plotdiv" id="4eb7ee0d-9bbd-4913-8fe3-cdf4ac8d3b76"></div>
  </div>
</div>

## Filter/Select Data

In the final example on types of interactive plots, I want to highlight a very different type of
desired interactions - filter/select data on the fly and keep updating the plot! I also want to
show the plots of maps and geo locations in bokeh. I will be using the [San Fransisco Crime
dataset][sfo] to showcase this.

[sfo]: https://www.kaggle.com/c/sf-crime/data
[gmap]: https://developers.google.com/maps/documentation/javascript/tutorial

Let us first download the file from abve link and load it as a dataframe:

```python
df_sfo = pd.read_csv("./train.csv")
```

Now, we want to look at the crime rate at different days of weeks. We want to view this
interactively. Users can choose All or a particular day and our plot should show us distribution of
crime for that/those days on the map. I will be using the google maps API for displaying the map.
You can get your own API at the [this link][gmap].

We will use the `Seelct` bokeh widget to let users choose the day of the week to visualize. Notice
the use of `callback` method to implement interaction between our widget and plot.

```python
from bokeh.models.widgets import Select
from bokeh.models import CustomJS
from bokeh.models import GMapOptions
from bokeh.plotting import gmap
from bokeh.layouts import column

source = ColumnDataSource(data=dict(
    x=df_sfo.head(350).X,
    y=df_sfo.head(350).Y,
    c=['blue']*350,
))

source2 = ColumnDataSource(data=dict(
    All_x=df_sfo.head(350).X,
    All_y=df_sfo.head(350).Y,
    All_c=['blue']*350,
    Sunday_x=df_sfo[df_sfo.DayOfWeek == 'Sunday'].head(50).X,
    Sunday_y=df_sfo[df_sfo.DayOfWeek == 'Sunday'].head(50).Y,
    Sunday_c=['red']*50,
    Monday_x=df_sfo[df_sfo.DayOfWeek == 'Monday'].head(50).X,
    Monday_y=df_sfo[df_sfo.DayOfWeek == 'Monday'].head(50).Y,
    Monday_c=['green']*50,
    Tuesday_x=df_sfo[df_sfo.DayOfWeek == 'Tuesday'].head(50).X,
    Tuesday_y=df_sfo[df_sfo.DayOfWeek == 'Tuesday'].head(50).Y,
    Tuesday_c=['cyan']*50,
    Wednesday_x=df_sfo[df_sfo.DayOfWeek == 'Wednesday'].head(50).X,
    Wednesday_y=df_sfo[df_sfo.DayOfWeek == 'Wednesday'].head(50).Y,
    Wednesday_c=['teal']*50,
    Thursday_x=df_sfo[df_sfo.DayOfWeek == 'Thursday'].head(50).X,
    Thursday_y=df_sfo[df_sfo.DayOfWeek == 'Thursday'].head(50).Y,
    Thursday_c=['orange']*50,
    Friday_x=df_sfo[df_sfo.DayOfWeek == 'Friday'].head(50).X,
    Friday_y=df_sfo[df_sfo.DayOfWeek == 'Friday'].head(50).Y,
    Friday_c=['black']*50,
    Saturday_x=df_sfo[df_sfo.DayOfWeek == 'Saturday'].head(50).X,
    Saturday_y=df_sfo[df_sfo.DayOfWeek == 'Saturday'].head(50).Y,
    Saturday_c=['pink']*50,
))

def callback(source=source, source2=source2):
    data = source.data
    data2 = source2.data
    f = cb_obj.value
    data.x = data2[f+'_x']
    data.y = data2[f+'_y']
    data.c = data2[f+'_c']
    source.change.emit()

select = Select(title="Day of Week:", value="All", callback=CustomJS.from_py_func(callback), options=['All', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])


map_options = GMapOptions(lat=37.7749, lng=-122.4194, map_type="roadmap", zoom=12)
p47 = gmap("YOUR_GMAP_API_KEY_HERE", map_options, title="San Fransisco")
p47.circle(x='x', y='y', size=15, fill_color='c', fill_alpha=0.8, source=source)

p477 = column(select, p47)
show(p477)
```

<div class="figure img-responsive" style="display:table; margin:0 auto;">
  <div class="bk-root">
    <div class="bk-plotdiv" id="263adf9e-e4ca-4956-b639-625cb60db723"></div>
  </div>
</div>

You can choose the Day of Week in the Selection dropdown menu at the top and see how the plot
updates itself. For this example, I have restricted to showing only 50 entries for each day to keep
the `js` file small.

{% signup "By the way..." %}
I'm starting an email list for people interested in AI development and programming in general.
If you enjoy that kind of stuff, you can join here and I'll notify you whenever I publish a new post.
No strings attached, unsubscribe anytime.
{% endsignup %}

## High level bokeh plots using holoviews Library

By now you might have noticed, bokeh provides only low level APIs for plotting. Theoretically this
enables to us plot any kind of complex plots. However, for common day-to-do plots like box plots,
histograms etc. we need to write a lot of code! Luckily, [holoviews] library comes to our rescue!

In the final example, I will show a simple example of box and histogram plots on [Boston Housing]
data using holoviews.

First we want to look at the distribution of prices for houses with different room sizes. We will
first need to bin no. of rooms using `cut()` method of pandas. Then we can make Box (Whisker) plot
using holoviews!

```python
import holoviews as hv
hv.extension('bokeh')

rooms = ['3', '4', '5', '6', '7', '8']
df_boston["NROOMS"] = pd.cut(df_boston.RM, 6, labels=rooms)

boxwhisker = hv.BoxWhisker(df_boston, 'NROOMS', 'price')

renderer = hv.renderer('bokeh')
p45 = renderer.get_plot(boxwhisker).state
p45.xaxis.axis_label = "No. of Rooms"
p45.y_range.end = 60
p45.yaxis.axis_label = "Price (in thousands)"
p45.plot_width = 500
show(p45)
```

Notice, plotting was just a single line in holoviews! Furthermore, we could get corresponding bokeh
figure from it and apply all modifications from bokeh. This makes it easy to use as well as quite
customizable.

<div class="figure img-responsive" style="display:table; margin:0 auto;">
  <div class="bk-root">
    <div class="bk-plotdiv" id="25335196-889d-4a91-abf1-50eab0a82026"></div>
  </div>
</div>

To illustrate making of histogram plots, we can take a look at the overall distribution of house
prices. We will first calculate the histograms using `numpy` and then plot it using holoviews.

```python
f, e = np.histogram(df_boston.price.values, 20)

hist = hv.Histogram((e, f))

p46 = renderer.get_plot(hist).state
p46.y_range.end = 90
p46.x_range.start = -1
p46.x_range.end = 55
p46.xaxis.axis_label = "Price (in thousands)"
p46.plot_width = 500
show(p46)
```

We get an interactive histogram plot with a single line of code!

<div class="figure img-responsive" style="display:table; margin:0 auto;">
  <div class="bk-root">
    <div class="bk-plotdiv" id="f1d5b738-1f83-49b0-89e6-81cde11f75fd"></div>
  </div>
</div>

Similar to the box plot, we customized it by getting the corresponding bokeh figure. We have
touched only the simplest of plots using holoviews. If you look at their web page, you can make
pretty complex interactive figures quite easily!

Hopefully, this was enough to convince to start using interactive plots for some of your [EDA]. Go
through the APIs of bokeh and holoviews to find additional details. Bokeh also provides a nice
[tutorial] for new users. If you have any question regarding any type of plot, feel free to leave a
comment below!

[tutorial]: https://mybinder.org/v2/gh/bokeh/bokeh-notebooks/master?filepath=tutorial%2F00%20-%20Introduction%20and%20Setup.ipynb

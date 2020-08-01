---
title: 'An Overview of Descriptive Statistics'
slug: 'descriptive-stats'
date: 2017-06-11
tags:
  - 'Algorithms'
---

One of the first tasks involved in any data science project is to get to understand the data. This
can be extremely beneficial for several reasons:

- Catch mistakes in data
- See patterns in data
- Find violations of statistical assumptions
- Generate hypotheses etc.

We can think of this task as an exercise in **summarization** of the data. To summarize the main
characteristics of the data, often two methods are used: numerical and graphical.

The numerical summary of data is done through
[_descriptive statistics_](https://en.wikipedia.org/wiki/Descriptive_statistics). While the
graphical summary of the data is done through
[_exploratory data analysis (EDA)_](https://en.wikipedia.org/wiki/Exploratory_data_analysis). In
this post, we will look at both of these fundamental data science techniques in more detail using
some examples.

## Descriptive Statistics

Descriptive statistics are statistics that quantitatively describe or summarize features of a
collection of information. Some measures that are commonly used to describe a data set are:

- Measures of Central Tendency or Measure of Location, such as _mean_
- Measures of Variability or Dispersion, such as _standard deviation_
- Measure of the shape of the distribution, such as _skewness_ or _kurtosis_
- Relative Standing Measures, such as _z-score_, _Quartiles_ etc.

### Measures of Central Tendency

Central tendency (or measure of central tendency) is a central or typical value for a probability
distribution. Measures of central tendency are often called _averages_. The most common measures of
central tendency are the [arithmetic mean][mean], the [median] and the [mode].

[mean]: https://en.wikipedia.org/wiki/Arithmetic_mean
[median]: https://en.wikipedia.org/wiki/Median'
[mode]: https://en.wikipedia.org/wiki/Mode_(statistics)

#### Mean

The arithmetic mean (or **mean** or **average**) is the most commonly used and readily understood
measure of central tendency. In statistics, however, the term average refers to any of the measures
of central tendency. If we have a data set containing the values $a_{1},a_{2},\ldots ,a_{n}$, then
the _arithmetic mean_, $A$ is defined by the formula:

$$
A = \frac{1}{n}\sum_{i=1}^{n} a_i = \frac{a_1 + a_2 + \ldots + a_n}{n}
$$

If the data set is a [statistical population][spp] (i.e., consists of every possible observation
and not just a subset of them), then the mean of that population is called the **population mean**.
If the data set is a [statistical sample][ssample] (a subset of the population), we call the
statistic resulting from this calculation a **sample mean**.

[spp]: https://en.wikipedia.org/wiki/Statistical_population
[ssample]: https://en.wikipedia.org/wiki/Sampling_(statistics)

Although, arithmetic mean is the most common definition of mean, several other types are means also
common. Some examples are: [Weighted mean][wmean], [Geometric mean][gmean], [Harmonic mean][hmean]
and [Trimmed mean][tmean] etc.

[wmean]: https://en.wikipedia.org/wiki/Weighted_arithmetic_mean
[gmean]: https://en.wikipedia.org/wiki/Geometric_mean
[hmean]: https://en.wikipedia.org/wiki/Harmonic_mean
[tmean]: https://en.wikipedia.org/wiki/Truncated_mean

#### Median

The median is the midpoint of the data set. This midpoint value is the point at which half the
observations are above the value and half the observations are below the value. The median is
determined by ranking the observations and finding the observation that are at the number
$\frac{[N + 1]}{2}$ in the ranked order. If the number of observations are even, then the median is
the average value of the observations that are ranked at numbers $\frac{[N]}{2}$ and
$\frac{[N + 1]}{2} + 1$.

#### Mean vs Median

The median and the mean both measure central tendency. But unusual values, called
[**outliers**][outliers], affect the median less than they affect the _mean_. When you have unusual
values, you can compare the _mean_ and the _median_ to decide which is the better measure to use.
If your data are symmetric, the _mean_ and _median_ are similar.

[outliers]: https://en.wikipedia.org/wiki/Outlier

The concept of median can be generalized as [quartiles]. Quartiles are the three values – the first
quartile at 25% ($Q_1$), the second quartile at 50% ($Q_2$ or [median]), and the third quartile at
75% ($Q_3$) – that divide a sample of ordered data into four equal parts.

[quartiles]: https://en.wikipedia.org/wiki/Quartile

#### Mode

The mode is the value that appears most often in a set of data. The mode of a [discrete probability
distribution][d_prob_dist] is the value x at which its [probability mass function][pmf] takes its
maximum value. In other words, it is the value that is most likely to be sampled.

[d_prob_dist]: https://en.wikipedia.org/wiki/Probability_distribution
[pmf]: https://en.wikipedia.org/wiki/Probability_mass_function

{% callout "action" %}
The [mode](<https://en.wikipedia.org/wiki/Mode_(statistics)>) can be used with
[mean](https://en.wikipedia.org/wiki/Arithmetic_mean) and [median](https://en.wikipedia.org/wiki/Median)
to provide an overall characterization of your
data _distribution_. The mode can also be used to identify problems in your data.
{% endcallout %}

[mean]: https://en.wikipedia.org/wiki/Arithmetic_mean
[median]: https://en.wikipedia.org/wiki/Median
[mode]: https://en.wikipedia.org/wiki/Mode_(statistics)

For example, a distribution that has more than one mode may identify that your sample includes data
from two populations. If the data contain two modes, the distribution is bimodal. If the data
contain more than two modes, the distribution is **multi-modal**.

#### Minimum and Maximum

Many a times looking at the smallest and largest data and their relative positioning wrt to other
central tendencies are also quite helpful.

Use the maximum/minimum to identify a possible outliers or any data- entry errors. One of the
simplest ways to assess the spread of your data is to compare the minimum and maximum. If the
maximum value is very high, even when you consider the center, the spread, and the shape of the
data, investigate the cause of the extreme value.

### Measures of Variability or Dispersion

Dispersion (also called **variability**, **scatter**, or **spread**) is the extent to which a
distribution is stretched. A measure of statistical dispersion is a non-negative real number that
is zero if all the data are the same and increases as the data become more diverse. Some common
examples of dispersion measures are: [Standard Deviation][sd], [Interquartile Range (IQR)][iqr],
[Mean Absolute Difference][gini] and [Median Absolute Difference][mad] etc.

[sd]: https://en.wikipedia.org/wiki/Standard_deviation
[iqr]: https://en.wikipedia.org/wiki/Interquartile_range
[gini]: https://en.wikipedia.org/wiki/Mean_absolute_difference
[mad]: https://en.wikipedia.org/wiki/Median_absolute_deviation

#### Standard Deviation

The _standard deviation_ is a measure of how spread out the data are about the [mean]. The symbol
$\sigma$ is often used to represent the **standard deviation of a population**, while $s$ is used
to represent the **standard deviation of a sample**.

If we have a data set containing the values $a_{1},a_{2},\ldots ,a_{n}$, then the _standard
deviation_, $\sigma$ is defined by the formula:

$$
\sigma = \sqrt{\frac{1}{n}\Big[\big(a_1 - A\big)^2 + \big(a_2 - A\big)^2 + \ldots + \big(a_n - A\big)^2\Big]}, \text{ where } A \text{ is the Mean}
$$

A higher standard deviation value indicates greater spread in the data. A good rule of thumb for a
[normal distribution][normal] is that approximately 68% of the values fall within one standard
deviation of the mean, 95% of the values fall within two standard deviations, and 99.7% of the
values fall within three standard deviations.

#### Interquartile Range (IQR)

The _interquartile range_ (IQR) is the distance between the first quartile ($Q_1$) and the third
quartile ($Q_3$). 50% of the data are within this range.

$$
IQR = Q_3 - Q_1
$$

The interquartile range can be used to describe the spread of the data. As the spread of the data
increases, the IQR becomes larger. It is also used to build [box plots].

[box plots]: https://en.wikipedia.org/wiki/Box_plot

#### Range

The _range_ is the difference between the _largest_ and _smallest_ data values in the sample. The
_range_ represents the interval that contains all the data values.

The _range_ can be used to understand the amount of _dispersion_ in the data. A large range value
indicates greater _dispersion_ in the data. A small range value indicates that there is less
_dispersion_ in the data. Because the _range_ is calculated using only two data values, it is more
useful with small data sets.

### Measure of the Shape of the Distribution

Generally speaking, a [moment] is a specific quantitative measure, used in both mechanics and
statistics, of the shape of a set of points. If the points represent probability density, then the
zero<sup>th</sup> moment is the total probability (i.e. one), the first moment is the [mean], the
second central moment is the [variance], the third central moment is the [skewness], and the fourth
central moment (with normalization and shift) is the [kurtosis].

[moment]: https://en.wikipedia.org/wiki/Moment_(mathematics)
[variance]: https://en.wikipedia.org/wiki/Variance
[skewness]: https://en.wikipedia.org/wiki/Skewness
[kurtosis]: https://en.wikipedia.org/wiki/Kurtosis

We have already seen the use of first and second moments in describing statistics. The shape of
distributions are further described using higher moments as described below.

#### Skewness

[skewness] is a measure of the asymmetry of the probability distribution of a real-valued random
variable about its measure of central tendency. The skewness value can be positive or negative, or
even undefined.

For a unimodal distribution, negative skew indicates that the tail on the left side of the
probability density function is longer or fatter than the right side – it does not distinguish
these two kinds of shape. Conversely, positive skew indicates that the tail on the right side is
longer or fatter than the left side. In multi-modal distributions and discrete distributions,
skewness is very difficult to interpret.

There are two common definitions of skewness:

A. **Pearson Moment Coefficient of Skewness**: Pearson Moment Coefficient of Skewness refers to the
third standardized moment, defined as:

$$
S_{Pearson}=\frac{E\big[X^3\big]-3\mu\sigma^2-\mu^3}{\sigma^3}
$$

where, $\mu$ is the mean, $\sigma$ is the standard deviation, $E$ is the [expectation
operator][eop], and $X$ refers to the data points.

[eop]: https://en.wikipedia.org/wiki/Expected_value

B. **Bowley Skewness:**

[Bowley skewness][bskew] is a way to measure skewness purely from quartiles. One of the most
popular ways to find skewness is the [ Pearson Mode Skewness formula][pms]. However, in order to
use it you must know the [mean], [mode] (or [median]) and [standard deviation][sd] for your data.
Sometimes you might not have that information; Instead you might have information about your
[quartiles].

{% signup "By the way..." %}
I'm starting an email list for people interested in AI development and programming in general.
If you enjoy that kind of stuff, you can join here and I'll notify you whenever I publish a new post.
No strings attached, unsubscribe anytime.
{% endsignup %}

[pms]: https://mathworld.wolfram.com/PearsonModeSkewness.html
[bskew]: https://mathworld.wolfram.com/BowleySkewness.html
[pskew]: https://mathworld.wolfram.com/Skewness.html

Bowley skewness is an important quantity, if you have extreme data values (outliers) or if you have
an [open-ended distribution][oedist].

[oedist]: https://stats.oecd.org/glossary/detail.asp?ID=3770

Mathematically, Bowley Skewness is defined as :

$$
S_{Bowley} = \frac{Q_3 + Q_1 - 2Q_2}{Q_3 - Q_1}
$$

where, $Q_1$, $Q_2$ and $Q_3$, represent, first, second and third quartiles, respectively. Bowley
Skewness is an absolute measure of skewness. In other words, it’s going to give you a result in the
units that your distribution is in. That’s compared to the Pearson Mode Skewness, which gives you
results in a dimensionless unit — the [standard deviation][sd]. This means that you cannot compare
the skewness of different distributions with different units using Bowley Skewness.

#### Kurtosis

[Kurtosis] indicates how the peak and tails of a distribution differ from the normal distribution.
Mathematically, it is the fourth standardized moment, defined as,

$$
Kurtosis = \frac{E\Big[\big(X-\mu\big)^4\Big]}{\sigma^4} - 3
$$

where, $\mu$ is the mean, $\sigma$ is the standard deviation, $E$ is the [expectation
operator][eop], and $X$ refers to the data points.

Use kurtosis to initially understand general characteristics about the distribution of your data.
Normally distributed data establish the baseline for kurtosis. A kurtosis value of 0 indicates that
the data follow the normal distribution perfectly. A kurtosis value that significantly deviates
from 0 may indicate that the data are not normally distributed.

A distribution that has a positive kurtosis value indicates that the distribution has heavier tails
and a sharper peak than the normal distribution. For example, data that follow a
[t-distribution][tdist] have a positive kurtosis value.

A distribution with a negative kurtosis value indicates that the distribution has lighter tails and
a flatter peak than the normal distribution. For example, data that follow a [beta
distribution][bdist] with first and second shape parameters equal to 2 have a negative kurtosis
value.

[tdist]: https://en.wikipedia.org/wiki/Student%27s_t-distribution
[bdist]: https://en.wikipedia.org/wiki/Beta_distribution

### Measures of Relative Standing

A measure of relative standing is a measure of where a data value stands relative to the
distribution of the whole data set. With an idea of relative standing, we can say things like, “You
got a really high score compared to the rest of the class” or, “that basketball player is unusually
short” etc. Some of the common measures of relative standings are: [z-score], [quartile] and
[percentile].

[z-score]: https://en.wikipedia.org/wiki/Standard_score
[quartile]: https://www.mathsisfun.com/data/quartiles.html
[percentile]: https://www.mathsisfun.com/data/percentiles.html

#### z-scores

The _z-score_ (or **standard score**) is the signed number of standard deviations by which the
value of an observation or data point is above the mean value of what is being observed or
measured. Observed values above the mean have positive standard scores, while values below the mean
have negative standard scores.

Mathematically, z-score of a raw score $x$ is given by,

$$
z = \frac{x - \mu}{\sigma}
$$

where, $\mu$ is the [mean] and $\sigma$ is the [standard deviation][sd] of the population.

The z-score is often used in the **z-test** in standardized testing – the analog of the [Student's
t-test][student] for a population whose parameters are known, rather than estimated. As it is very
unusual to know the entire population, the t-test is much more widely used.

[student]: https://en.wikipedia.org/wiki/Student%27s_t-test

#### Quartiles and Percentiles

A _percentile_ is a measure used in statistics indicating the value below which a given percentage
of observations in a group of observations fall. For example, the 20th percentile is the value (or
score) below which 20 percent of the observations may be found. The term percentile and the related
term, _percentile rank_, are often used in the reporting of scores from norm-referenced tests. For
example, if a score is in the 86<sup>th</sup> percentile, it is higher than 86% of the other
scores. The 25<sup>th</sup> percentile is also known as the first quartile ($Q_1$), the
50<sup>th</sup> percentile as the median or second quartile ($Q_2$), and the 75<sup>th</sup>
percentile as the third quartile ($Q_3$).

#### Correlations

Often the data that we deal with is multi-dimensional in nature. [correlation] most often refers to
the extent to which two variables have a linear relationship with each other. Correlations are
useful because they can indicate a predictive relationship that can be exploited in practice.

The most familiar measure of dependence between two quantities is the [Pearson product-moment
correlation coefficient][corr], or **"Pearson's correlation coefficient"**, commonly called simply
**"the correlation coefficient"**.

[correlation]: https://en.wikipedia.org/wiki/Correlation_and_dependence
[corr]: https://en.wikipedia.org/wiki/Pearson_product-moment_correlation_coefficient

The population correlation coefficient $\rho_{X, Y}$ between two variates $X$ and $Y$ with means
$\mu_X$ and $\mu_Y$ and standard deviations $\sigma_X$ and $\sigma_Y$ is defined as:

$$
\rho_{X, Y} = \frac{cov(X, Y)}{\sigma_X \sigma_Y} = \frac{E\Big[\big(X-\mu_X\big)\big(Y-\mu_Y\big)\Big]}{\sigma_X \sigma_Y}
$$

where $E$ is the [expectation operator][eop], and $cov$ means [covariance].

[covariance]: https://en.wikipedia.org/wiki/Covariance

There are additional alternative ways to measures of correlations. Some common examples are: [Rank
Correlation][rc], [Distance Correlation][dc], [polychoric correlation][pc] and [correlation
ratio][cr] etc. Each of such measures capture different aspects of the data and should be used with
care depending on the situation.

[rc]: https://en.wikipedia.org/wiki/Rank_correlation
[dc]: https://en.wikipedia.org/wiki/Distance_correlation
[pc]: https://en.wikipedia.org/wiki/Polychoric_correlation
[cr]: https://en.wikipedia.org/wiki/Correlation_ratio

Most correlation measures are sensitive to the manner in which $X$ and $Y$ are sampled.
Dependencies tend to be stronger if viewed over a wider range of values. Sensitivity to the data
distribution can be used to an advantage. For example, scaled correlation is designed to use the
sensitivity to the range in order to pick out correlations between fast components of time series.

🔥**Correlation does not imply causation.**🔥 If a strong correlation is observed between two
variables A and B, there are several possible explanations: (a) A influences B; (b) B influences A;
(c) A and B are influenced by one or more additional variables; (d) the relationship observed
between A and B was a chance error.

Small correlation values do not necessarily indicate that two variables are disassociated. For
example, Pearson's coefficients will underestimate the association between two variables that show
a quadratic relationship. You should always examine the scatter plot in the EDA.

The correlation of two variables that both have been recorded repeatedly over time can be
misleading and spurious. Time trends should be removed from such data before attempting to measure
correlation. Caution should be used in interpreting results of correlation analysis when large
numbers of variables have been examined, resulting in a large number of correlation coefficients.

## Exploratory Data Analysis (EDA)

[Exploratory data analysis (EDA)][eda] is an approach to analyzing data sets to summarize their
main characteristics, often with visual methods. The objectives of EDA are to:

- Suggest hypotheses about the causes of observed phenomena
- Assess assumptions on which statistical inference will be based
- Support the selection of appropriate statistical tools and techniques
- Provide a basis for further data collection through surveys or experiments

[eda]: https://en.wikipedia.org/wiki/Exploratory_data_analysis

Typical graphical techniques used in [EDA][eda] are:

- [Box Plot](https://en.wikipedia.org/wiki/Box_plot)
- [Histogram](https://en.wikipedia.org/wiki/Histogram)
- [Multi-Vari Chart](https://en.wikipedia.org/wiki/Exploratory_data_analysis)
- [Run Chart](https://en.wikipedia.org/wiki/Run_chart)
- [Pareto Chart](https://en.wikipedia.org/wiki/Pareto_chart)
- [Scatter Plot](https://en.wikipedia.org/wiki/Scatter_plot)
- [Stem-and-Leaf Plot](https://en.wikipedia.org/wiki/Stemplot)
- [Parallel Coordinates](https://en.wikipedia.org/wiki/Parallel_coordinates)
- [Odd Ratio](https://en.wikipedia.org/wiki/Odds_ratio)
- [Multidimensional Scaling](https://en.wikipedia.org/wiki/Multidimensional_scaling)
- [Targeted Projection Pursuit](https://en.wikipedia.org/wiki/Targeted_projection_pursuit)
- [Principal Component Analysis (PCA)](https://en.wikipedia.org/wiki/Principal_component_analysis)
- [Multi-linear PCA](https://en.wikipedia.org/wiki/Multilinear_principal_component_analysis)
- [Dimensionality Reduction](https://en.wikipedia.org/wiki/Dimensionality_reduction)
- [Nonlinear Dimensionality Reduction (NLDR)](https://en.wikipedia.org/wiki/Nonlinear_dimensionality_reduction)

Typical quantitative techniques used in [EDA][eda] are:

- [Median Polish](https://en.wikipedia.org/wiki/Median_polish)
- [Trimean](https://en.wikipedia.org/wiki/Trimean)
- [Ordination](<https://en.wikipedia.org/wiki/Ordination_(statistics)>)

I will be going through mathematical details of some of others in future posts.

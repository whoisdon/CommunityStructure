const msToDate = (ms) => {
    ms = Math.round(ms / 1000);
    const s = ms % 60, m = ~~((ms / 60) % 60), h = ~~((ms / 60 / 60) % 24), d = ~~(ms / 60 / 60 / 24);
    return `${d}d:${h}h:${m}m:${s}s`;
}

export default msToDate;

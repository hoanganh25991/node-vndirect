/**
 * Simple track timer
 * @returns {*}
 * @constructor
 */
export const TrackTime = () => {
  const time = { start: null, end: null }

  return {
    start() {
      time.start = new Date().getTime()
    },
    end() {
      time.end = new Date().getTime()
      const seconds = Math.floor((time.end - time.start) / 1000).toFixed(2)
      console.log(`Done in ${seconds}s`)
    },
    time() {
      return time
    },
    diff() {
      const now = new Date().getTime()
      return now - time.start
    }
  }
}

export default TrackTime

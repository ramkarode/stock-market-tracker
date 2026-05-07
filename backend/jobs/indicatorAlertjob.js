const cron = require("node-cron");

let isStarted = false;

const startCronJobs = () => {
  if (isStarted) return; // prevent duplicate start
  isStarted = true;

  console.log("Cron Jobs Started");

  // Every minute (example)
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Running cron job");
      //will write logic later and frequency will be changed as per requirement later

    } catch (err) {
      console.error("Cron error:", err.message);
    }
  });

  // Daily job
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Daily job running");
      //will write logic later
    } catch (err) {
      console.error("Daily cron error:", err.message);
    }
  });
};

module.exports = startCronJobs;

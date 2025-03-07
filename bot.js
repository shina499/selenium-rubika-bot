const readline = require('readline'); // برای دریافت ورودی دستی از کاربر
const { Builder, By, until } = require('selenium-webdriver');

async function waitForUserInput(message) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(message, answer => {
        rl.close();
        resolve(answer);
    }));
}

async function runBot() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 1️⃣ ورود به روبیکا
        await driver.get('https://web.rubika.ir');
        console.log("🔹 لطفاً وارد حساب روبیکا شوید و کد ورود را بزنید، سپس Enter بزنید...");
        
        // 2️⃣ منتظر ماندن برای ورود دستی
        await waitForUserInput("✅ وقتی ورود را انجام دادی، Enter بزن...");
        console.log("✅ ورود تأیید شد! ادامه می‌دهیم...");

        // 3️⃣ جستجوی چت موردنظر
        const chatName = 'MoM'; // نام چت را اینجا بگذار
        console.log(`🔍 در حال جستجوی چت: "${chatName}" ...`);

        let searchBox = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='جستجو']")), 10000);
        await searchBox.sendKeys(chatName);
        await driver.sleep(3000);

        // 4️⃣ استفاده از متد executeScript برای کلیک روی عنصر
        let chat = await driver.wait(until.elementLocated(By.xpath(`//span[contains(text(), '${chatName}')]`)), 15000);
        await driver.wait(until.elementIsVisible(chat), 10000); // اطمینان از اینکه عنصر قابل دیدن است
        await driver.executeScript("arguments[0].click();", chat);
        console.log(`✅ چت "${chatName}" پیدا شد و باز شد!`);

        // 5️⃣ ارسال پیام
        await driver.sleep(2000);
        let messageBox = await driver.wait(until.elementLocated(By.className('composer_rich_textarea')), 10000);
        await messageBox.sendKeys('سلام! این یک پیام تستی از ربات است. \n');
        console.log("✅ پیام ارسال شد!");

        // 6️⃣ چند ثانیه صبر کرده و مرورگر را ببند
        await driver.sleep(5000);
        await driver.quit();
        console.log("🔻 ربات بسته شد.");
        
    } catch (error) {
        console.error("❌ خطا:", error);
        await driver.quit();
    }
}

runBot();


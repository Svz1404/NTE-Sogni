import { launch } from 'puppeteer';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import cfonts from "cfonts";
import fs from 'fs/promises';
import readline from 'readline';

// Function to read user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

// Function to read proxies from file
async function getProxies() {
    try {
        await fs.access('proxy.txt'); // Check if the file exists
        const data = await fs.readFile('proxy.txt', 'utf8');
        return data.split('\n').map(line => line.trim()).filter(line => line);
    } catch (error) {
        console.error('proxy.txt not found. Creating an empty file.');
        await fs.writeFile('proxy.txt', '', 'utf8');
        return [];
    }
}
async function testProxies(proxies) {
    for (const proxy of proxies) {
        try {
            const response = await fetch('https://api.ipify.org?format=json', {
                proxy: `http://${proxy}`
            });
            console.log(`Proxy ${proxy} is working:`, await response.json());
        } catch (err) {
            console.log(`Proxy ${proxy} failed:`, err.message);
        }
    }
}
async function getVerificationLink(username,domain) {
    try {
        // Request ke halaman email
        const response = await fetch('https://generator.email/inbox4/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cookie': `_gid=GA1.2.362826212.1741845886; surl=${domain}/${username}` // Sesuaikan cookie jika perlu
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Ambil teks HTML dari response
        const html = await response.text();

        // Load HTML dengan cheerio
        const $ = cheerio.load(html);

        // Cari elemen <td> dengan bgcolor="#F0008F"
        const verificationLink = $('td[bgcolor="#F0008F"] a').attr('href');

        if (verificationLink) {
            return verificationLink;
        } else {
            console.log('Verification link not found.');
            return null;
        }

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
// Function to get random user details
async function getRandomUser() {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const user = data.results[0];
        return {
            firstName: user.name.first,
            lastName: user.name.last
        };
    } catch (error) {
        console.error('Error fetching random user:', error);
        return null;
    }
}

// Function to handle Puppeteer automation
async function runAutomation(proxy = null,kodeReff) {
    const user = await getRandomUser();
    if (!user) return;

    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const Listdomains = [
        "giayhieucu.com", "pizzamagic.com", "ebarg.net", "hieuclone.com", "aggressivesa.online",
        "iyilemtudes.shop", "bytedigi.com", "gmailbrt.com", "clonemailsieure.com", "disipulo.com",
        "flameoflovedegree.com", "plussparknet.com", "mykeiani.com", "cloneads.top", "sozenit.com",
        "7rv.es", "prembyadetrio.com", "huyvillafb.online", "taphoaclone.net", "rashchotimah.co",
        "saxlift.us", "glitteringmediaswari.io", "lechatiao.com", "jagomail.com", "ahucantogan.shop",
        "meta-support-12sk6xj81.com", "fkmalozmpclf.cfd", "mailvn.top", "abyssmail.com", "chupanhcuoidep.com",
        "packiu.com", "kimgmail.com", "lauramiehillhomestead.com", "mailenla.network", "tinyios.com",
        "dogonoithatlienha.com", "minggu.me", "getimell.com", "cumfoto.com", "cakybo.com", "golviagenxs.com",
        "rapatbahjatya.net", "sunstorevn.com", "dmxs8.com", "nelcoapps.com"
    ];
    const domain = Listdomains[Math.floor(Math.random() * Listdomains.length)];
    const username = `${user.firstName}${user.lastName}${randomNumber}`;
    const emailAddress = `${username}@${domain}`;
    const password = username;

    console.log(`Creating account: ${username} | ${emailAddress} | ${password}`);

    // Launch Puppeteer with proxy if provided
    let args = [];
    if (proxy) {
        const proxyParts = proxy.split('@');
        if (proxyParts.length === 2) {
            const [auth, address] = proxyParts;
            const [proxyUser, proxyPass] = auth.split(':');
            args.push(`--proxy-server=http://${address}`);
        } else {
            args.push(`--proxy-server=http://${proxy}`);
        }
    }

    const browser = await launch({ headless: false, args });
        const page = await browser.newPage();

        // Authenticate if proxy has credentials
        if (proxy && proxy.includes('@')) {
            const [auth] = proxy.split('@');
            const [proxyUser, proxyPass] = auth.split(':');
            await page.authenticate({ username: proxyUser, password: proxyPass });
        }
    
    await page.goto('https://app.sogni.ai/');
    
    await page.waitForSelector('body > div._backdrop_1y9op_1 > div > div > div._contentPanel_e6t3l_74 > div._formFooter_e6t3l_116 > button._button_1a2p7_1._variant-primary_1a2p7_52._size-md_1a2p7_90._fullWidth_1a2p7_23',{timeout:60000})
    await page.click('body > div._backdrop_1y9op_1 > div > div > div._contentPanel_e6t3l_74 > div._formFooter_e6t3l_116 > button._button_1a2p7_1._variant-primary_1a2p7_52._size-md_1a2p7_90._fullWidth_1a2p7_23')
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Create Account using Username : '+username+' | Email : '+emailAddress+' | Password :'+password)
    
        await page.waitForSelector('input[name="username"]',{timeout:60000})
        await page.type('input[name="username"]',username)
        await new Promise(resolve => setTimeout(resolve, 500));
    
        await page.waitForSelector('input[name="email"]',{timeout:60000})
        await page.type('input[name="email"]',emailAddress)
        await new Promise(resolve => setTimeout(resolve, 500));
    
        await page.waitForSelector('input[name="referralCode"]',{timeout:60000})
        await page.type('input[name="referralCode"]',kodeReff)
        await new Promise(resolve => setTimeout(resolve, 2000));
    
        await page.waitForSelector(`body > div._backdrop_1y9op_1 > div > div > form > div._formFooter_e6t3l_116 > button._button_1a2p7_1._variant-primary_1a2p7_52._size-md_1a2p7_90._fullWidth_1a2p7_23`)
        await page.click('body > div._backdrop_1y9op_1 > div > div > form > div._formFooter_e6t3l_116 > button._button_1a2p7_1._variant-primary_1a2p7_52._size-md_1a2p7_90._fullWidth_1a2p7_23')
        await new Promise(resolve => setTimeout(resolve, 3000));
        await page.waitForSelector('input[name="password"]',{timeout:60000})
        await page.type('input[name="password"]',password)
        await new Promise(resolve => setTimeout(resolve, 500));
        await page.waitForSelector('input[name="passwordConfirm"]',{timeout:60000})
        await page.type('input[name="passwordConfirm"]',password)
        await new Promise(resolve => setTimeout(resolve, 2000));
    
        await page.waitForSelector('body > div._backdrop_1y9op_1 > div > div > form > div._formFooter_e6t3l_116 > div > div > label._checkbox_1nxlm_1 > div > svg',{timeout:60000})
        await page.click('body > div._backdrop_1y9op_1 > div > div > form > div._formFooter_e6t3l_116 > div > div > label._checkbox_1nxlm_1 > div > svg')
        await new Promise(resolve => setTimeout(resolve, 1000));
    
        await page.waitForSelector('body > div._backdrop_1y9op_1 > div > div > form > div._formFooter_e6t3l_116 > button',{timeout:60000})
        await page.click('body > div._backdrop_1y9op_1 > div > div > form > div._formFooter_e6t3l_116 > button')
        await new Promise(resolve => setTimeout(resolve, 3000));
    
        
    
        await page.waitForSelector('body > div._backdrop_1y9op_1 > div > div > form > div._formFooter_e6t3l_116 > button._button_1a2p7_1._variant-primary_1a2p7_52._size-md_1a2p7_90._fullWidth_1a2p7_23',{timeout:60000})
        await page.click('body > div._backdrop_1y9op_1 > div > div > form > div._formFooter_e6t3l_116 > button._button_1a2p7_1._variant-primary_1a2p7_52._size-md_1a2p7_90._fullWidth_1a2p7_23')
        await new Promise(resolve => setTimeout(resolve, 5000));
    
        await page.waitForSelector('body > div._backdrop_1y9op_1 > div > div > div._contentPanel_e6t3l_74 > div._formContent_e6t3l_95 > div._emailConfirmation_iz7bu_221 > div > h3',{timeout:60000})
        const getResult = await page.$eval('body > div._backdrop_1y9op_1 > div > div > div._contentPanel_e6t3l_74 > div._formContent_e6t3l_95 > div._emailConfirmation_iz7bu_221 > div > h3',(el) =>el.textContent)
        console.log('Result Register => '+getResult)
        await page.waitForSelector('body > div._backdrop_1y9op_1 > div > div > div._contentPanel_e6t3l_74 > div._formFooter_e6t3l_116 > button',{timeout:60000})
        await page.click('body > div._backdrop_1y9op_1 > div > div > div._contentPanel_e6t3l_74 > div._formFooter_e6t3l_116 > button')
        await new Promise(resolve => setTimeout(resolve, 5000));
    
        const getVerif = await getVerificationLink(username,domain)
        console.log('Successfully Get Email Link Vertification => '+getVerif)
    
        const page2 = await browser.newPage(); 
    
        await page2.goto(getVerif); 
    
        await page2.waitForSelector(`body > section.successsection > div > div > h1`,{timeout:60000})
        const resultVerif = await page2.$eval('body > section.successsection > div > div > h1',(el) => el.textContent)
          console.log(resultVerif)
          const dataHasil = `Username: ${username} | Email: ${emailAddress} | Password: ${password} | Hasil : ${resultVerif}\n\n`;
          await fs.appendFile('accounts.txt', dataHasil, 'utf8');
          console.log('Account details saved successfully!');

    await browser.close();
    console.log(`Completed for ${emailAddress}`);
}

// Main execution flow
(async () => {
  cfonts.say("NT Exhaust", {
  font: "block",
  align: "center",
  colors: ["cyan", "magenta"],
  background: "black",
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: "0",
});
console.log(centerText("=== Telegram Channel 🚀 : NT Exhaust (@NTExhaust) ==="));
console.log(centerText("⌞👤 Mod : @NT_Exhaust ⌝ \n"));
    const kodeReff = await askQuestion('Reff Code: ');
    const useProxy = await askQuestion('Use proxy? (yes/no): ');
    let loopCount;
    let proxies = [];

    if (useProxy.toLowerCase() === 'yes') {
        proxies = await getProxies();
        if (proxies.length === 0) {
            console.log('No proxies found in proxy.txt');
            rl.close();
            return;
        }
        loopCount = proxies.length;
    } else {
        loopCount = parseInt(await askQuestion('Enter loop count: '), 10);
    }

    for (let i = 0; i < loopCount; i++) {
        const proxy = useProxy.toLowerCase() === 'yes' ? proxies[i] : null;
        try{
        await runAutomation(proxy,kodeReff);
        }
        catch{
            console.log("Terjadi Kesalahan Dalam Nama,atau Yang lain!")
        }
    }
    
    rl.close();
})();

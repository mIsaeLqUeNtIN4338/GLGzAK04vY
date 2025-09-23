// 代码生成时间: 2025-09-24 01:13:35
const Fs = require('fs');
const Path = require('path');

// 函数：整理文件夹结构
async function organizeFolders(baseDirectory) {
  // 检查目录是否存在
  if (!Fs.existsSync(baseDirectory)) {
    throw new Error('Base directory does not exist');
  }

  // 读取目录内容
  const files = Fs.readdirSync(baseDirectory);
  for (const file of files) {
    const fullPath = Path.join(baseDirectory, file);
    const stats = Fs.statSync(fullPath);

    // 如果是文件夹，则进入递归逻辑
    if (stats.isDirectory()) {
      try {
        await organizeFolders(fullPath); // 递归调用整理子文件夹
      } catch (error) {
        console.error(`Error organizing folder ${fullPath}: ${error}`);
      }
    }
  }

  console.log(`Folder structure organized: ${baseDirectory}`);
}

// 主函数：设置基础目录并执行整理
async function main() {
  const baseDirectory = './'; // 可以更改为想要整理的目录路径
  try {
    await organizeFolders(baseDirectory);
  } catch (error) {
    console.error(`Failed to organize folders: ${error}`);
  }
}

// 执行主函数
main();
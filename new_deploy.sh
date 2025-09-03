#!/bin/bash -e

npx hardhat run ./app/database/deleteDB.ts
npx hardhat run ./app/database/initializeDB.ts
npx hardhat run ./contracts/scripts/Transfers/deployPoolUsers.ts
npx hardhat run ./contracts/scripts/ProbabilisticCompliance/deployMixerOnboardingAndTransfersV3Probabilistic.ts
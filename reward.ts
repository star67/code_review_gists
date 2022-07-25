async function rewardUser(userId: string, materials: Material[]) {
    const bonusService = getBonusService();
    const bonusAmounts = [];

    if (await checkUserExists(userId) && materials.length) {
        for (const material of materials) {
            const bonusAmount = await bonusService.getBonusAmount(userId, material.id);
            bonusAmounts.push(bonusAmount);
        }

        const hasPremiumMaterial = materials.find(material => material.id.toLowerCase().startsWith('p')) !== undefined;
        if (hasPremiumMaterial) {
            const amountPremium = await bonusService.getPremiumBonusAmount(userId);
            bonusAmounts.push(amountPremium);
        }
    } else {
        throw new Error(`User or materials are absent!`);
    }

    let total = 0;
    for (let i = 0; i < bonusAmounts.length; i++) {
        const reward = await Reward.query()
            .insert({
                id: 'coins',
                amount: bonusAmounts[i],
                userId: userId,
            });
        total += reward.amount;
    }

    return {
        currency: 'coins',
        total,
    };
}

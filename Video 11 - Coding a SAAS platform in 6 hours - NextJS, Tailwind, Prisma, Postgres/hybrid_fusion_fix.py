"""
================================================================================
HYBRID FUSION MODEL - COMPLETE FIX
Replace the relevant sections in your notebook with this code
================================================================================
"""

# ============================================================================
# HYBRID FUSION TRAINING (FIXED VERSION - COPY THIS TO YOUR NOTEBOOK)
# ============================================================================

# Initialize training history BEFORE the training loop
training_history = {
    'train_loss': [],
    'train_acc': [],
    'val_loss': [],
    'val_acc': []
}

num_epochs = 60
best_val_acc = 0

for epoch in range(num_epochs):
    # Train
    model.train()
    train_loss = 0
    train_correct = 0
    train_total = 0
    
    for mfcc, logmel, labels in train_loader:
        mfcc, logmel, labels = mfcc.to(device), logmel.to(device), labels.to(device)
        
        if np.random.rand() < 0.5:
            mixed_mfcc, mixed_logmel, labels_a, labels_b, lam = mixup_data(
                mfcc, logmel, labels, alpha=0.4
            )
            optimizer.zero_grad()
            outputs = model(mixed_mfcc, mixed_logmel)
            loss = mixup_criterion(criterion, outputs, labels_a, labels_b, lam)
        else:
            optimizer.zero_grad()
            outputs = model(mfcc, logmel)
            loss = criterion(outputs, labels)
        
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        scheduler.step(epoch + train_correct / len(train_loader))
        
        train_loss += loss.item()
        _, predicted = torch.max(outputs, 1)
        train_total += labels.size(0)
        train_correct += (predicted == labels).sum().item()
    
    avg_train_loss = train_loss / len(train_loader)
    train_acc = train_correct / train_total
    
    # Validation
    model.eval()
    val_loss = 0
    val_correct = 0
    val_total = 0
    
    with torch.no_grad():
        for mfcc, logmel, labels in val_loader:
            mfcc, logmel, labels = mfcc.to(device), logmel.to(device), labels.to(device)
            outputs = model(mfcc, logmel)
            loss = criterion(outputs, labels)
            
            val_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            val_total += labels.size(0)
            val_correct += (predicted == labels).sum().item()
    
    avg_val_loss = val_loss / len(val_loader)
    val_acc = val_correct / val_total
    
    # Store history
    training_history['train_loss'].append(avg_train_loss)
    training_history['train_acc'].append(train_acc)
    training_history['val_loss'].append(avg_val_loss)
    training_history['val_acc'].append(val_acc)
    
    if (epoch + 1) % 5 == 0 or epoch == 0:
        print(f"Epoch {epoch+1:3d}/{num_epochs} - Train: {train_acc*100:.2f}% - Val: {val_acc*100:.2f}%")
    
    if val_acc > best_val_acc:
        best_val_acc = val_acc
        torch.save(model.state_dict(), os.path.join(paths['models'], 'optimized_best.pth'))
        print(f"  ✓ Best: {val_acc*100:.2f}%")

# Save results WITH training history
hybrid_results = {
    'accuracy': hybrid_accuracy,
    'precision': precision,
    'recall': recall,
    'f1': f1,
    'predictions': np.array(all_preds),
    'labels': np.array(all_labels),
    'probabilities': np.zeros((len(all_preds), len(EMOTION_CLASSES))),
    'confusion_matrix': confusion_matrix(all_labels, all_preds),
    'training_history': training_history
}

with open(os.path.join(paths['results'], 'hybrid_fusion_results.pkl'), 'wb') as f:
    pickle.dump(hybrid_results, f)

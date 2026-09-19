import SwiftUI

// MARK: - Dark-Themed Professional Bottom Toolbar with Expandable Brush Controls

public struct BottomToolbarView: View {
    @ObservedObject public var state: TracingAppState
    @Binding public var isTargetPickerPresented: Bool
    @Binding public var isExportPresented: Bool
    
    @State private var isBrushKitExpanded: Bool = false
    @State private var isReferenceSlidersExpanded: Bool = false
    
    public init(
        state: TracingAppState,
        isTargetPickerPresented: Binding<Bool>,
        isExportPresented: Binding<Bool>
    ) {
        self.state = state
        self._isTargetPickerPresented = isTargetPickerPresented
        self._isExportPresented = isExportPresented
    }
    
    public var body: some View {
        VStack(spacing: 12) {
            // Expandable Brush Sliders Panel (Thickness & Opacity)
            if isBrushKitExpanded {
                VStack(spacing: 16) {
                    // Line Thickness Slider
                    HStack(spacing: 12) {
                        Image(systemName: "pencil.tip")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.gray)
                            .frame(width: 20)
                        
                        Text("Thickness")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(width: 75, alignment: .leading)
                        
                        Slider(value: $state.lineWidth, in: 1...40, step: 1)
                            .tint(.blue)
                        
                        Text("\(Int(state.lineWidth)) pt")
                            .font(.system(size: 12, weight: .bold, design: .monospaced))
                            .foregroundColor(.white)
                            .frame(width: 44, alignment: .trailing)
                    }
                    
                    // Brush Opacity Slider
                    HStack(spacing: 12) {
                        Image(systemName: "drop.fill")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.gray)
                            .frame(width: 20)
                        
                        Text("Opacity")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(width: 75, alignment: .leading)
                        
                        Slider(value: $state.brushOpacity, in: 0.1...1.0, step: 0.05)
                            .tint(.blue)
                        
                        Text("\(Int(state.brushOpacity * 100))%")
                            .font(.system(size: 12, weight: .bold, design: .monospaced))
                            .foregroundColor(.white)
                            .frame(width: 44, alignment: .trailing)
                    }
                    
                    // Vibrant Color Swatches
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 10) {
                            ForEach(state.vibrantColors, id: \.self) { color in
                                let isSelected = state.selectedColor == color && state.currentTool == .brush
                                Button(action: {
                                    state.selectedColor = color
                                    state.currentTool = .brush
                                }) {
                                    Circle()
                                        .fill(color)
                                        .frame(width: isSelected ? 32 : 26, height: isSelected ? 32 : 26)
                                        .overlay(
                                            Circle()
                                                .stroke(Color.white, lineWidth: isSelected ? 2.5 : 1)
                                        )
                                        .shadow(color: isSelected ? color.opacity(0.6) : .clear, radius: 6)
                                }
                            }
                        }
                        .padding(.horizontal, 4)
                        .padding(.vertical, 4)
                    }
                }
                .padding(16)
                .background(Color(red: 0.14, green: 0.14, blue: 0.16).opacity(0.95))
                .cornerRadius(22)
                .overlay(
                    RoundedRectangle(cornerRadius: 22)
                        .stroke(Color.white.opacity(0.12), lineWidth: 1)
                )
                .padding(.horizontal, 16)
                .transition(.scale.combined(with: .opacity))
            }
            
            // Expandable Reference Alpha Slider
            if isReferenceSlidersExpanded {
                HStack(spacing: 12) {
                    Image(systemName: "slider.horizontal.3")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.cyan)
                    
                    Text("Template Alpha")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(.cyan)
                    
                    Slider(value: $state.referenceOpacity, in: 0.0...1.0, step: 0.05)
                        .tint(.cyan)
                        .onChange(of: state.referenceOpacity) { val in
                            state.isReferenceVisible = val > 0.01
                            if val > 0.05 {
                                state.lastActiveReferenceOpacity = val
                            }
                        }
                    
                    Text("\(Int(state.referenceOpacity * 100))%")
                        .font(.system(size: 12, weight: .bold, design: .monospaced))
                        .foregroundColor(.cyan)
                        .frame(width: 44, alignment: .trailing)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color(red: 0.14, green: 0.14, blue: 0.16).opacity(0.95))
                .cornerRadius(18)
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(Color.cyan.opacity(0.25), lineWidth: 1)
                )
                .padding(.horizontal, 16)
                .transition(.scale.combined(with: .opacity))
            }
            
            // Main Floating Capsule Toolbar
            HStack(spacing: 10) {
                // 1. Target Selector (opens 3 offline channels)
                Button(action: {
                    isTargetPickerPresented = true
                }) {
                    HStack(spacing: 6) {
                        Image(systemName: "sparkles")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.cyan)
                        Text("Target")
                            .font(.system(size: 13, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color.white.opacity(0.08))
                    .clipShape(Capsule())
                }
                .help("Select Tracing Target from Vector Library, Photos, or Files")
                
                // 2. Adjust Reference Alignment Toggle
                Button(action: {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                        state.isAdjustingReference.toggle()
                    }
                }) {
                    Image(systemName: "arrow.up.and.down.and.arrow.left.and.right")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(state.isAdjustingReference ? .black : .white)
                        .frame(width: 36, height: 36)
                        .background(state.isAdjustingReference ? Color.cyan : Color.white.opacity(0.08))
                        .clipShape(Circle())
                        .shadow(color: state.isAdjustingReference ? Color.cyan.opacity(0.4) : .clear, radius: 8)
                }
                .help("Pan and Scale Tracing Reference")
                
                // 3. Quick Eye Toggle (0% <-> 100% Opacity)
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        state.toggleReferenceEye()
                    }
                }) {
                    Image(systemName: state.isReferenceVisible ? "eye.fill" : "eye.slash.fill")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(state.isReferenceVisible ? .cyan : .gray)
                        .frame(width: 36, height: 36)
                        .background(Color.white.opacity(0.08))
                        .clipShape(Circle())
                }
                .help("Quick Eye Toggle (0% vs Previous Opacity)")
                
                // Sliders panel trigger
                Button(action: {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                        isReferenceSlidersExpanded.toggle()
                    }
                }) {
                    Image(systemName: "slider.horizontal.3")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(isReferenceSlidersExpanded ? .cyan : .gray)
                        .frame(width: 32, height: 32)
                        .background(isReferenceSlidersExpanded ? Color.cyan.opacity(0.15) : Color.clear)
                        .clipShape(Circle())
                }
                
                Divider()
                    .frame(height: 20)
                    .background(Color.white.opacity(0.2))
                
                // 4. Brush Kit Button
                Button(action: {
                    state.currentTool = .brush
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                        isBrushKitExpanded.toggle()
                    }
                }) {
                    HStack(spacing: 6) {
                        Image(systemName: "paintbrush.pointed.fill")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(state.currentTool == .brush ? .black : .white)
                        Circle()
                            .fill(state.selectedColor)
                            .frame(width: 10, height: 10)
                            .overlay(Circle().stroke(Color.black.opacity(0.3), lineWidth: 1))
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(state.currentTool == .brush ? Color.white : Color.white.opacity(0.08))
                    .clipShape(Capsule())
                }
                .help("Brush Tool & Vibrant Color Swatches")
                
                // 5. Pixel-Accurate Eraser Tool Button
                Button(action: {
                    state.currentTool = .eraser
                    isBrushKitExpanded = false
                }) {
                    Image(systemName: "eraser.fill")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(state.currentTool == .eraser ? .black : .white)
                        .frame(width: 36, height: 36)
                        .background(state.currentTool == .eraser ? Color.white : Color.white.opacity(0.08))
                        .clipShape(Circle())
                }
                .help("Pixel-Accurate Eraser (Leaves Reference Untouched)")
                
                Spacer()
                
                // 6. 15-Step Undo & Redo Matrix
                HStack(spacing: 5) {
                    Button(action: {
                        state.undo()
                    }) {
                        Image(systemName: "arrow.uturn.backward")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(state.canUndo ? .white : .gray.opacity(0.4))
                            .frame(width: 32, height: 32)
                            .background(Color.white.opacity(state.canUndo ? 0.10 : 0.04))
                            .clipShape(Circle())
                    }
                    .disabled(!state.canUndo)
                    
                    Button(action: {
                        state.redo()
                    }) {
                        Image(systemName: "arrow.uturn.forward")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(state.canRedo ? .white : .gray.opacity(0.4))
                            .frame(width: 32, height: 32)
                            .background(Color.white.opacity(state.canRedo ? 0.10 : 0.04))
                            .clipShape(Circle())
                    }
                    .disabled(!state.canRedo)
                }
                
                Divider()
                    .frame(height: 20)
                    .background(Color.white.opacity(0.2))
                
                // 7. Export / Save to Photos Button
                Button(action: {
                    isExportPresented = true
                }) {
                    HStack(spacing: 4) {
                        Image(systemName: "square.and.arrow.up")
                            .font(.system(size: 12, weight: .bold))
                        Text("Export")
                            .font(.system(size: 12, weight: .bold))
                    }
                    .foregroundColor(.cyan)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 7)
                    .background(Color.cyan.opacity(0.18))
                    .clipShape(Capsule())
                    .overlay(
                        Capsule().stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                    )
                }
                .help("Export Drawing to iOS Photos Library")
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(Color(red: 0.12, green: 0.12, blue: 0.14).opacity(0.95))
            .clipShape(Capsule())
            .overlay(
                Capsule()
                    .stroke(Color.white.opacity(0.14), lineWidth: 1)
            )
            .shadow(color: .black.opacity(0.5), radius: 16, y: 6)
            .padding(.horizontal, 16)
            .padding(.bottom, 10)
        }
    }
}

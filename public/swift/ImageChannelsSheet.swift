import SwiftUI
import PhotosUI
import UniformTypeIdentifiers

// MARK: - 3 Local-Only Offline Image Channels Sheet

public struct ImageChannelsSheet: View {
    @ObservedObject public var state: TracingAppState
    @Environment(\.dismiss) private var dismiss
    
    @State private var selectedCategory: VectorCategory = .all
    
    // Channel 2: PhotosUI State
    @State private var selectedPhotosPickerItem: PhotosPickerItem? = nil
    @State private var isPhotoLoading: Bool = false
    @State private var photoErrorMessage: String? = nil
    
    // Channel 3: Files App Importer State
    @State private var isFileImporterPresented: Bool = false
    @State private var fileErrorMessage: String? = nil
    
    // Channel 4 / Featured: Drawing Shape Library
    @State private var isDrawingShapeLibraryPresented: Bool = false
    
    public init(state: TracingAppState) {
        self.state = state
    }
    
    private var filteredShapes: [VectorShapeType] {
        if selectedCategory == .all {
            return VectorShapeType.allCases
        } else {
            return VectorShapeType.allCases.filter { $0.category == selectedCategory }
        }
    }
    
    public var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.10, green: 0.10, blue: 0.12)
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        // Section Header
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Drawing Library")
                                .font(.system(size: 20, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                            Text("100% offline & local. Choose from vector shapes, curated SF symbols, photo library, or files.")
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(.gray)
                        }
                        .padding(.horizontal, 20)
                        
                        // FEATURED CHANNEL: Drawing Shape Library (Hundreds of Traceable Symbols)
                        VStack(alignment: .leading, spacing: 10) {
                            HStack {
                                Label("Drawing Shape Library", systemImage: "sparkles")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.cyan)
                                Spacer()
                                Text("250+ Trace-Ready Shapes")
                                    .font(.system(size: 11, weight: .semibold))
                                    .foregroundColor(.cyan.opacity(0.85))
                            }
                            .padding(.horizontal, 20)
                            
                            Button(action: {
                                isDrawingShapeLibraryPresented = true
                            }) {
                                HStack(spacing: 14) {
                                    ZStack {
                                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                                            .fill(Color.cyan.opacity(0.18))
                                            .frame(width: 48, height: 48)
                                        Image(systemName: "sparkles.rectangle.stack.fill")
                                            .font(.system(size: 22, weight: .bold))
                                            .foregroundColor(.cyan)
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 3) {
                                        HStack(spacing: 6) {
                                            Text("Browse Drawing Shape Library")
                                                .font(.system(size: 15, weight: .bold))
                                                .foregroundColor(.white)
                                            Text("FEATURED")
                                                .font(.system(size: 9, weight: .heavy))
                                                .foregroundColor(.black)
                                                .padding(.horizontal, 6)
                                                .padding(.vertical, 2)
                                                .background(Color.cyan)
                                                .clipShape(Capsule())
                                        }
                                        Text("Nature, Vehicles, Gaming, Sports & Geometry shapes with automated pattern variations")
                                            .font(.system(size: 11, weight: .regular))
                                            .foregroundColor(.gray)
                                            .lineLimit(1)
                                    }
                                    
                                    Spacer()
                                    
                                    Image(systemName: "chevron.right")
                                        .font(.system(size: 13, weight: .bold))
                                        .foregroundColor(.gray)
                                }
                                .padding(14)
                                .background(Color.white.opacity(0.06))
                                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                                        .stroke(Color.cyan.opacity(0.35), lineWidth: 1)
                                )
                            }
                            .padding(.horizontal, 20)
                        }
                        
                        Divider()
                            .background(Color.white.opacity(0.1))
                            .padding(.horizontal, 20)
                        
                        // CHANNEL 1: Quick Vector Shapes (15 Shapes)
                        VStack(alignment: .leading, spacing: 14) {
                            HStack {
                                Label("Quick Vector Shapes", systemImage: "sparkles.rectangle.stack.fill")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.cyan)
                                Spacer()
                                Text("15 Shapes • Infinite Scale")
                                    .font(.system(size: 11, weight: .semibold))
                                    .foregroundColor(.gray)
                            }
                            .padding(.horizontal, 20)
                            
                            // Category Chips
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 8) {
                                    ForEach(VectorCategory.allCases) { cat in
                                        Button {
                                            selectedCategory = cat
                                        } label: {
                                            HStack(spacing: 4) {
                                                Text(cat.emoji)
                                                Text(cat.rawValue)
                                            }
                                            .font(.system(size: 12, weight: .semibold))
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 6)
                                            .background(selectedCategory == cat ? Color.cyan : Color.white.opacity(0.08))
                                            .foregroundColor(selectedCategory == cat ? .black : .white)
                                            .clipShape(Capsule())
                                        }
                                    }
                                }
                                .padding(.horizontal, 20)
                            }
                            
                            // Grid of Shapes
                            let columns = [
                                GridItem(.adaptive(minimum: 85), spacing: 12)
                            ]
                            
                            LazyVGrid(columns: columns, spacing: 12) {
                                ForEach(filteredShapes) { shapeType in
                                    let isSelected = state.referenceTarget == .vector(shapeType)
                                    
                                    Button(action: {
                                        state.setVectorTarget(shapeType)
                                        dismiss()
                                    }) {
                                        VStack(spacing: 6) {
                                            ZStack {
                                                RoundedRectangle(cornerRadius: 16, style: .continuous)
                                                    .fill(isSelected ? Color.cyan.opacity(0.2) : Color.white.opacity(0.05))
                                                    .overlay(
                                                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                                                            .stroke(isSelected ? Color.cyan : Color.white.opacity(0.12), lineWidth: isSelected ? 2 : 1)
                                                    )
                                                    .frame(height: 80)
                                                
                                                VectorRendererView(
                                                    shapeType: shapeType,
                                                    strokeColor: isSelected ? Color.cyan : Color.white.opacity(0.85),
                                                    lineWidth: 2.2
                                                )
                                                .frame(width: 44, height: 44)
                                            }
                                            
                                            Text(shapeType.rawValue)
                                                .font(.system(size: 11, weight: .bold, design: .rounded))
                                                .foregroundColor(isSelected ? .cyan : .white)
                                                .lineLimit(1)
                                        }
                                    }
                                }
                            }
                            .padding(.horizontal, 20)
                        }
                        
                        Divider()
                            .background(Color.white.opacity(0.1))
                            .padding(.horizontal, 20)
                        
                        // CHANNEL 2: iOS Photos Library
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Label("Photos Library", systemImage: "photo.on.rectangle.angled")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.green)
                                Spacer()
                                Text("Filtered for .images")
                                    .font(.system(size: 11, weight: .semibold))
                                    .foregroundColor(.gray)
                            }
                            .padding(.horizontal, 20)
                            
                            PhotosPicker(
                                selection: $selectedPhotosPickerItem,
                                matching: .images,
                                photoLibrary: .shared()
                            ) {
                                HStack(spacing: 14) {
                                    ZStack {
                                        Circle()
                                            .fill(Color.green.opacity(0.18))
                                            .frame(width: 44, height: 44)
                                        Image(systemName: "photo.badge.plus")
                                            .font(.system(size: 18, weight: .semibold))
                                            .foregroundColor(.green)
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Select from Photos Library")
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(.white)
                                        Text("Loads asynchronously via PhotosUI loadTransferable")
                                            .font(.system(size: 11, weight: .regular))
                                            .foregroundColor(.gray)
                                    }
                                    
                                    Spacer()
                                    
                                    if isPhotoLoading {
                                        ProgressView()
                                            .tint(.white)
                                    } else {
                                        Image(systemName: "chevron.right")
                                            .font(.system(size: 13, weight: .bold))
                                            .foregroundColor(.gray)
                                    }
                                }
                                .padding(14)
                                .background(Color.white.opacity(0.06))
                                .cornerRadius(18)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 18)
                                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                                    )
                                .padding(.horizontal, 20)
                            }
                            .onChange(of: selectedPhotosPickerItem) { newItem in
                                guard let item = newItem else { return }
                                isPhotoLoading = true
                                Task {
                                    do {
                                        if let data = try await item.loadTransferable(type: Data.self),
                                           let uiImage = UIImage(data: data) {
                                            await MainActor.run {
                                                state.setImageTarget(uiImage)
                                                isPhotoLoading = false
                                                dismiss()
                                            }
                                        } else {
                                            await MainActor.run {
                                                photoErrorMessage = "Could not decode image data."
                                                isPhotoLoading = false
                                            }
                                        }
                                    } catch {
                                        await MainActor.run {
                                            photoErrorMessage = "Failed to load photo: \(error.localizedDescription)"
                                            isPhotoLoading = false
                                        }
                                    }
                                }
                            }
                            
                            if let err = photoErrorMessage {
                                Text(err)
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(.red)
                                    .padding(.horizontal, 20)
                            }
                        }
                        
                        Divider()
                            .background(Color.white.opacity(0.1))
                            .padding(.horizontal, 20)
                        
                        // CHANNEL 3: iOS Files App (fileImporter)
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Label("iOS Files App / iCloud", systemImage: "folder.badge.plus")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.orange)
                                Spacer()
                                Text("PNG or JPEG with Security Scoping")
                                    .font(.system(size: 11, weight: .semibold))
                                    .foregroundColor(.gray)
                            }
                            .padding(.horizontal, 20)
                            
                            Button(action: {
                                isFileImporterPresented = true
                            }) {
                                HStack(spacing: 14) {
                                    ZStack {
                                        Circle()
                                            .fill(Color.orange.opacity(0.18))
                                            .frame(width: 44, height: 44)
                                        Image(systemName: "doc.badge.plus")
                                            .font(.system(size: 18, weight: .semibold))
                                            .foregroundColor(.orange)
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Import from Files App")
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(.white)
                                        Text("Direct device downloads, AirDrop, or iCloud Drive")
                                            .font(.system(size: 11, weight: .regular))
                                            .foregroundColor(.gray)
                                    }
                                    
                                    Spacer()
                                    
                                    Image(systemName: "chevron.right")
                                        .font(.system(size: 13, weight: .bold))
                                        .foregroundColor(.gray)
                                }
                                .padding(14)
                                .background(Color.white.opacity(0.06))
                                .cornerRadius(18)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 18)
                                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                                )
                                .padding(.horizontal, 20)
                            }
                            
                            if let err = fileErrorMessage {
                                Text(err)
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(.red)
                                    .padding(.horizontal, 20)
                            }
                        }
                        .fileImporter(
                            isPresented: $isFileImporterPresented,
                            allowedContentTypes: [.png, .jpeg],
                            allowsMultipleSelection: false
                        ) { result in
                            switch result {
                            case let .success(urls):
                                guard let selectedUrl = urls.first else { return }
                                
                                let didStartAccessing = selectedUrl.startAccessingSecurityScopedResource()
                                defer {
                                    if didStartAccessing {
                                        selectedUrl.stopAccessingSecurityScopedResource()
                                    }
                                }
                                
                                do {
                                    let data = try Data(contentsOf: selectedUrl)
                                    if let uiImage = UIImage(data: data) {
                                        state.setImageTarget(uiImage)
                                        dismiss()
                                    } else {
                                        fileErrorMessage = "File format could not be decoded as an image."
                                    }
                                } catch {
                                    fileErrorMessage = "Failed to read file: \(error.localizedDescription)"
                                }
                                
                            case let .failure(error):
                                fileErrorMessage = "File import cancelled or failed: \(error.localizedDescription)"
                            }
                        }
                    }
                    .padding(.vertical, 20)
                }
            }
            .navigationTitle("Select Drawing")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
                }
            }
            .sheet(isPresented: $isDrawingShapeLibraryPresented) {
                DrawingShapeLibraryView(
                    selectedSymbolName: Binding(
                        get: {
                            if case let .symbol(sym) = state.referenceTarget { return sym }
                            return nil
                        },
                        set: { newSym in
                            if let newSym = newSym {
                                state.setSymbolTarget(newSym)
                                dismiss()
                            }
                        }
                    ),
                    onSelectSymbol: { symbolName in
                        state.setSymbolTarget(symbolName)
                        dismiss()
                    }
                )
            }
        }
    }
}
